import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { toFile } from 'openai';

interface GenerateRequest {
  roomImageBase64: string;
  roomImageMimeType: string;
  furnitureItems: Array<{
    imageUrl: string;
    name: string;
    description?: string;
  }>;
  roomType: string;
  designStyle: string;
}


// Fetch image from URL and convert to buffer
async function fetchImageAsBuffer(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const mimeType = response.headers.get('content-type') || 'image/jpeg';
  return { buffer, mimeType };
}

// Convert base64 data URL to buffer
function base64ToBuffer(base64: string): Buffer {
  // Handle data URL format
  if (base64.startsWith('data:')) {
    const matches = base64.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      return Buffer.from(matches[2], 'base64');
    }
  }
  // Plain base64
  return Buffer.from(base64, 'base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const { roomImageBase64, roomImageMimeType, furnitureItems, roomType, designStyle } = req.body as GenerateRequest;

  if (!roomImageBase64) {
    return res.status(400).json({ error: 'Room image is required' });
  }

  if (!furnitureItems || furnitureItems.length === 0) {
    return res.status(400).json({ error: 'At least one furniture item is required' });
  }

  const openai = new OpenAI({ apiKey });

  try {
    // Prepare image files for the API
    const imageFiles: Awaited<ReturnType<typeof toFile>>[] = [];

    // 1. Room image (first, most important)
    const roomBuffer = base64ToBuffer(roomImageBase64);
    const extension = roomImageMimeType.split('/')[1] || 'jpeg';
    const roomFile = await toFile(roomBuffer, `room.${extension}`, { type: roomImageMimeType });
    imageFiles.push(roomFile);

    // 2. Fetch furniture product images (up to 4 more for highest fidelity - total 5)
    const maxFurnitureImages = Math.min(furnitureItems.length, 4);
    for (let i = 0; i < maxFurnitureImages; i++) {
      const item = furnitureItems[i];
      try {
        const { buffer, mimeType } = await fetchImageAsBuffer(item.imageUrl);
        const ext = mimeType.split('/')[1] || 'jpeg';
        const furnitureFile = await toFile(buffer, `furniture_${i + 1}.${ext}`, { type: mimeType });
        imageFiles.push(furnitureFile);
      } catch (fetchError) {
        console.warn(`Failed to fetch furniture image for ${item.name}:`, fetchError);
        // Continue with other images
      }
    }

    // Build furniture reference list for prompt
    const furnitureReferences = furnitureItems.map((item, index) => {
      const desc = item.description ? ` (${item.description})` : '';
      if (index < maxFurnitureImages) {
        return `- Reference image ${index + 2}: ${item.name}${desc}`;
      }
      return `- ${item.name}${desc} (described only, no reference image)`;
    });

    // Build the prompt that references the images
    const prompt = `Look at the first image (the room photo) and the IKEA product reference images.
Replace the existing furniture in the room with the EXACT IKEA products shown in the reference images.

FURNITURE TO PLACE:
${furnitureReferences.join('\n')}

CRITICAL REQUIREMENTS - The furniture must appear EXACTLY as in the product images:
- Same color (do not change colors - if the product is black, it must be black in the result)
- Same shape and design (exact same style, legs, armrests, etc.)
- Same proportions and size relative to the reference

ROOM PRESERVATION:
- Keep all other room elements UNCHANGED: walls, floor, ceiling, lighting, windows, doors
- Maintain the same perspective and camera angle as the original room photo
- Keep the same lighting conditions and shadows

PLACEMENT:
- Position the furniture naturally where the old furniture was
- Ensure proper scale relative to the room
- Add realistic shadows under the furniture

The result should be photorealistic, as if the IKEA furniture was photographed in this actual room.`;

    console.log('Generating with GPT Image 1.5 - multi-image edit...');
    console.log(`Images: 1 room + ${imageFiles.length - 1} furniture references`);

    // Use images.edit() with multiple image inputs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai.images.edit as any)({
      model: 'gpt-image-1.5',
      image: imageFiles,
      prompt: prompt,
      size: '1536x1024',
      quality: 'high',
    });

    // GPT Image models return base64-encoded images
    const imageData = response.data?.[0];

    if (!imageData?.b64_json) {
      return res.status(500).json({
        error: 'No image generated',
        details: response,
      });
    }

    // Return as data URL
    const imageUrl = `data:image/png;base64,${imageData.b64_json}`;

    return res.status(200).json({
      success: true,
      imageUrl,
      generated_image_url: imageUrl,
      provider: 'openai',
      model: 'gpt-image-1.5',
    });
  } catch (error) {
    console.error('OpenAI generation error:', error);

    if (error instanceof OpenAI.APIError) {
      return res.status(error.status || 500).json({
        error: `OpenAI API error: ${error.message}`,
        code: error.code,
      });
    }

    return res.status(500).json({
      error: 'Failed to generate design',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
