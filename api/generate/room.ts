import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GenerateRequest {
  roomImageUrl: string;
  furnitureItems: Array<{
    url: string;
    name: string;
  }>;
  roomType: string;
  designStyle: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DECOR8_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { roomImageUrl, furnitureItems, roomType, designStyle } = req.body as GenerateRequest;

  if (!roomImageUrl) {
    return res.status(400).json({ error: 'Room image URL is required' });
  }

  try {
    const response = await fetch('https://api.decor8.ai/generate_designs_for_room', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_image_url: roomImageUrl,
        room_type: roomType || 'livingroom',
        design_style: designStyle || 'modern',
        num_images: 1,
        decor_items: furnitureItems?.map((item) => ({
          url: item.url,
          name: item.name,
        })) || [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Decor8 API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Decor8 API error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();

    // Extract the generated image URL from the response
    const imageUrl = data.generated_image_url || data.image_url || data.images?.[0]?.url;

    if (!imageUrl) {
      return res.status(500).json({
        error: 'No image URL in response',
        data,
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl,
      generated_image_url: imageUrl,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate design',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
