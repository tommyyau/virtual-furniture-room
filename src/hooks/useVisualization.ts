import { useCallback } from 'react';
import { useVisualizationStore, useRoomStore, useFurnitureStore } from '../store';
import { generateRoomVisualization } from '../services/decor8';
import type { VisualizationResult } from '../types';

export function useVisualization() {
  const { roomImage, roomType, designStyle, aiProvider } = useRoomStore();
  const selectedItems = useFurnitureStore((state) => state.selectedItems);
  const { status, result, error, setStatus, setResult, setError, reset } =
    useVisualizationStore();

  const generate = useCallback(async (): Promise<VisualizationResult | null> => {
    if (!roomImage || selectedItems.length === 0) {
      setError('Please upload a room photo and select furniture');
      return null;
    }

    setStatus('generating');
    setError(null);

    try {
      const response = await generateRoomVisualization({
        roomImageBase64: '',  // Will be populated from file
        roomImageMimeType: '',  // Will be populated from file
        roomImageFile: roomImage.file,  // Pass the File for base64 conversion
        furnitureItems: selectedItems.map((item) => ({
          imageUrl: item.imageUrl,
          name: item.name,
          description: item.description,
        })),
        roomType,
        designStyle,
        provider: aiProvider,
      });

      if (response.success && response.imageUrl) {
        const result: VisualizationResult = {
          id: crypto.randomUUID(),
          originalRoomUrl: roomImage.url,
          generatedImageUrl: response.imageUrl,
          furnitureItems: selectedItems,
          roomType,
          designStyle,
          provider: aiProvider,
          createdAt: new Date().toISOString(),
        };
        setResult(result);
        return result;
      } else {
        setError(response.error || 'Failed to generate design');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    }
  }, [roomImage, selectedItems, roomType, designStyle, aiProvider, setStatus, setResult, setError]);

  const isReady = !!roomImage && selectedItems.length > 0;
  const isLoading = status === 'uploading' || status === 'generating';

  return {
    status,
    result,
    error,
    generate,
    reset,
    isReady,
    isLoading,
  };
}
