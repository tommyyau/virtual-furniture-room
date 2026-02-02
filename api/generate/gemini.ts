import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GenerateRequest {
  roomImageUrl: string;
  furnitureItems: Array<{
    url: string;
    name: string;
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { roomImageUrl, furnitureItems, roomType, designStyle } = req.body as GenerateRequest;

  if (!roomImageUrl) {
    return res.status(400).json({ error: 'Room image URL is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Nano Banana Pro (gemini-3-pro-image-preview) - highest quality
    // Falls back gracefully if not available
    const modelId = 'gemini-3-pro-image-preview';

    const model = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: {
        // @ts-ignore - responseModalities is required for image generation
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Build furniture description
    const furnitureList = furnitureItems
      ?.map((item) => item.name)
      .join(', ') || 'modern furniture';

    const roomDesc = ROOM_TYPE_DESCRIPTIONS[roomType] || 'room';
    const styleDesc = STYLE_DESCRIPTIONS[designStyle] || 'modern style';

    const prompt = `Generate a photorealistic interior design photograph of a ${roomDesc}.

FURNITURE TO INCLUDE (place these items naturally in the room):
${furnitureList}

DESIGN STYLE: ${styleDesc}

REQUIREMENTS:
- Create a completely photorealistic image, like a professional real estate or interior design photo
- Position furniture in natural, logical locations
- Include realistic lighting and shadows under all furniture
- The room should feel cohesive and professionally designed
- High quality, sharp details
- Natural color palette appropriate for the ${styleDesc} style

Generate the interior design image now.`;

    console.log(`Generating with ${modelId}...`);

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract image from response
    let imageUrl = null;
    let textResponse = '';

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if ('text' in part) {
        textResponse = part.text || '';
      }
      if ('inlineData' in part && part.inlineData) {
        // Convert base64 to data URL
        const { mimeType, data } = part.inlineData;
        imageUrl = `data:${mimeType};base64,${data}`;
      }
    }

    if (!imageUrl) {
      return res.status(200).json({
        success: false,
        error: 'Gemini did not generate an image',
        textResponse,
        model: modelId,
        note: 'Free tier may have limited image generation. Try OpenAI instead.',
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl,
      generated_image_url: imageUrl,
      provider: 'gemini',
      model: modelId,
    });
  } catch (error) {
    console.error('Gemini generation error:', error);

    return res.status(500).json({
      error: 'Failed to generate design with Gemini',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Free tier limits may apply. Try using OpenAI instead.',
    });
  }
}
