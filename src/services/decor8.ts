import type { GenerationRequest, GenerationResponse, AIProvider } from '../types';

const API_BASE = '/api/generate';

const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  openai: `${API_BASE}/openai`,
  gemini: `${API_BASE}/gemini`,
  decor8: `${API_BASE}/room`,
};

export async function generateRoomVisualization(
  request: GenerationRequest
): Promise<GenerationResponse> {
  const provider = request.provider || 'openai';
  const endpoint = PROVIDER_ENDPOINTS[provider];

  try {
    const response = await fetch(endpoint, {
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
        provider,
      };
    }

    const data = await response.json();

    if (data.generated_image_url || data.imageUrl) {
      return {
        success: true,
        imageUrl: data.generated_image_url || data.imageUrl,
        provider,
      };
    }

    return {
      success: false,
      error: data.error || 'No image URL in response',
      provider,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      provider,
    };
  }
}

export async function uploadImageToUrl(file: File): Promise<string> {
  // For now, create a local blob URL
  // In production, you would upload to a cloud storage service
  return URL.createObjectURL(file);
}
