import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useRoomStore, useFurnitureStore, useVisualizationStore } from '../../store';
import { generateRoomVisualization } from '../../services/decor8';
import { AI_PROVIDER_INFO } from '../../types/visualization';
import './GenerateButton.css';

interface GenerateButtonProps {
  disabled?: boolean;
}

export function GenerateButton({ disabled }: GenerateButtonProps) {
  const navigate = useNavigate();
  const { roomImage, roomType, designStyle, aiProvider } = useRoomStore();
  const selectedItems = useFurnitureStore((state) => state.selectedItems);
  const { status, setStatus, setResult, setError } = useVisualizationStore();

  const isReady = roomImage && selectedItems.length > 0;
  const isLoading = status === 'uploading' || status === 'generating';
  const providerInfo = AI_PROVIDER_INFO[aiProvider];

  const handleGenerate = useCallback(async () => {
    if (!roomImage || selectedItems.length === 0) return;

    setStatus('generating');
    setError(null);

    try {
      const response = await generateRoomVisualization({
        roomImageUrl: roomImage.url,
        furnitureItems: selectedItems.map((item) => ({
          url: item.imageUrl,
          name: item.name,
        })),
        roomType,
        designStyle,
        provider: aiProvider,
      });

      if (response.success && response.imageUrl) {
        setResult({
          id: crypto.randomUUID(),
          originalRoomUrl: roomImage.url,
          generatedImageUrl: response.imageUrl,
          furnitureItems: selectedItems,
          roomType,
          designStyle,
          provider: aiProvider,
          createdAt: new Date().toISOString(),
        });
        navigate('/result');
      } else {
        setError(response.error || 'Failed to generate design');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  }, [roomImage, selectedItems, roomType, designStyle, aiProvider, setStatus, setResult, setError, navigate]);

  return (
    <div className="generate-button-container">
      <Button
        variant="primary"
        size="lg"
        onClick={handleGenerate}
        disabled={disabled || !isReady}
        loading={isLoading}
        className="generate-button"
      >
        {isLoading ? 'Generating...' : 'Generate Design'}
      </Button>
      {isReady && (
        <p className="generate-button-cost">
          Using {providerInfo.name} ({providerInfo.cost})
        </p>
      )}
      {!isReady && (
        <p className="generate-button-hint">
          {!roomImage
            ? 'Upload a room photo to continue'
            : 'Select at least one furniture item'}
        </p>
      )}
    </div>
  );
}
