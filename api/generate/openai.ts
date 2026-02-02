import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

interface GenerateRequest {
  roomImageUrl: string;
  furnitureItems: Array<{
    url: string;
    name: string;
    description?: string;
  }>;
  roomType: string;
  designStyle: string;
}

const ROOM_TYPE_DESCRIPTIONS: Record<string, string> = {
  livingroom: 'living room',
  bedroom: 'bedroom',
  diningroom: 'dining room',
  office: 'home office',
  kitchen: 'kitchen',
};

const STYLE_DESCRIPTIONS: Record<string, string> = {
  modern: 'modern style with clean lines and contemporary aesthetic',
  minimalist: 'minimalist style with sparse, uncluttered design',
  scandinavian: 'Scandinavian style with light woods and cozy feel',
  industrial: 'industrial style with exposed materials and metal accents',
  traditional: 'traditional style with classic elegance',
  bohemian: 'bohemian style with eclectic textures',
};

// Fetch image and convert to base64 for OpenAI
async function fetchImageAsBase64(url: string): Promise<string> {
  // Handle blob URLs by returning a placeholder instruction
  if (url.startsWith('blob:')) {
    throw new Error('Blob URLs cannot be fetched server-side. Please upload room image to a public URL.');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  return `data:${contentType};base64,${base64}`;
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

  const { roomImageUrl, furnitureItems, roomType, designStyle } = req.body as GenerateRequest;

  if (!roomImageUrl) {
    return res.status(400).json({ error: 'Room image URL is required' });
  }

  const openai = new OpenAI({ apiKey });

  try {
    // Build furniture description
    const furnitureList = furnitureItems
      ?.map((item) => item.name)
      .join(', ') || 'modern furniture';

    const roomDesc = ROOM_TYPE_DESCRIPTIONS[roomType] || 'room';
    const styleDesc = STYLE_DESCRIPTIONS[designStyle] || 'modern style';

    // For GPT Image 1.5, we can use the edit endpoint with image inputs
    // or generate with a detailed prompt

    // Build a detailed prompt for image generation
    const prompt = `Create a photorealistic interior design photograph of a ${roomDesc}.

The room should contain the following furniture items, placed naturally and realistically:
${furnitureList}

STYLE REQUIREMENTS:
- ${styleDesc}
- Professional interior design photography quality
- Natural lighting with realistic shadows under all furniture
- Furniture positioned in logical locations (sofas against walls, tables in open areas)
- High-end real estate photography aesthetic
- Photorealistic, not illustrated or 3D rendered

TECHNICAL REQUIREMENTS:
- Sharp, high-quality image
- Proper perspective and proportions
- Cohesive color palette that matches the ${styleDesc} aesthetic
- The furniture should look like it genuinely belongs in the space`;

    console.log('Generating with GPT Image 1.5...');

    // Use gpt-image-1.5 - OpenAI's latest image generation model
    const response = await openai.images.generate({
      model: 'gpt-image-1.5',
      prompt: prompt,
      n: 1,
      size: '1536x1024', // Landscape format for rooms
      quality: 'high',
    });

    // GPT Image models return base64-encoded images
    const imageData = response.data[0];

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
