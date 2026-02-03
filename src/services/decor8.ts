import type { GenerationRequest, GenerationResponse, AIProvider } from '../types';

const API_BASE = '/api/generate';

const PROVIDER_ENDPOINTS: Record<AIProvider, string> = {
  openai: `${API_BASE}/openai`,
  gemini: `${API_BASE}/gemini`,
  decor8: `${API_BASE}/room`,
};

// Convert a File to base64 string
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract just the base64 part (after the data URL prefix)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Get MIME type from file
export function getFileMimeType(file: File): string {
  return file.type || 'image/jpeg';
}

export async function generateRoomVisualization(
  request: GenerationRequest & { roomImageFile?: File }
): Promise<GenerationResponse> {
  const provider = request.provider || 'openai';
  const endpoint = PROVIDER_ENDPOINTS[provider];

  try {
    // Convert room image file to base64 if provided
    let roomImageBase64 = request.roomImageBase64;
    let roomImageMimeType = request.roomImageMimeType;

    if (request.roomImageFile) {
      roomImageBase64 = await fileToBase64(request.roomImageFile);
      roomImageMimeType = getFileMimeType(request.roomImageFile);
    }

    if (!roomImageBase64) {
      return {
        success: false,
        error: 'Room image is required',
        provider,
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomImageBase64,
        roomImageMimeType,
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
