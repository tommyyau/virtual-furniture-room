import type { GenerationRequest, GenerationResponse } from '../types';

const API_BASE = '/api/generate';

// Alternative implementation using OpenAI GPT Image 1
// Can be used as a fallback or alternative to Decor8

export async function generateWithOpenAI(
  request: GenerationRequest
): Promise<GenerationResponse> {
  try {
    const response = await fetch(`${API_BASE}/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomImageUrl: request.roomImageUrl,
        furnitureItems: request.furnitureItems,
        roomType: request.roomType,
        designStyle: request.designStyle,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `API error: ${response.status}`,
      };
    }

    const data = await response.json();

    if (data.imageUrl) {
      return {
        success: true,
        imageUrl: data.imageUrl,
      };
    }

    return {
      success: false,
      error: 'No image URL in response',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
