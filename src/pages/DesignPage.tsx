import { useNavigate } from 'react-router-dom';
import { RoomPreview } from '../components/room/RoomPreview';
import { SelectedItems } from '../components/furniture/SelectedItems';
import { GenerateButton } from '../components/visualization/GenerateButton';
import { LoadingState } from '../components/visualization/LoadingState';
import { Button } from '../components/ui/Button';
import { useRoomStore, useFurnitureStore, useVisualizationStore } from '../store';
import { AI_PROVIDER_INFO } from '../types/visualization';
import './DesignPage.css';

// Only show OpenAI for now - other providers hidden until API keys configured
const VISIBLE_PROVIDERS = ['openai'] as const;

export function DesignPage() {
  const navigate = useNavigate();
  const { roomImage, aiProvider, setAIProvider } = useRoomStore();
  const selectedItems = useFurnitureStore((state) => state.selectedItems);
  const { status, error } = useVisualizationStore();

  const handleBack = () => {
    navigate('/catalog');
  };

  const isGenerating = status === 'generating' || status === 'uploading';

  if (!roomImage) {
    return (
      <div className="design-page">
        <div className="design-page-empty">
          <h2>No room photo uploaded</h2>
          <p>Please upload a room photo to continue</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Upload Photo
          </Button>
        </div>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="design-page">
        <div className="design-page-empty">
          <h2>No furniture selected</h2>
          <p>Please select at least one furniture item</p>
          <Button variant="primary" onClick={() => navigate('/catalog')}>
            Browse Furniture
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="design-page">
      <div className="design-page-header">
        <div>
          <h1 className="design-page-title">Design Your Room</h1>
          <p className="design-page-subtitle">
            Configure your design preferences and generate your visualization
          </p>
        </div>
        <Button variant="ghost" onClick={handleBack}>
          Back
        </Button>
      </div>

      {error && (
        <div className="design-page-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="design-page-content">
        <div className="design-page-main">
          <div className="design-section">
            <h2 className="design-section-title">Your Room</h2>
            <RoomPreview showClearButton={false} />
          </div>

          {VISIBLE_PROVIDERS.length > 1 && (
            <div className="design-section">
              <h2 className="design-section-title">AI Provider</h2>
              <p className="design-section-hint">Choose which AI service to use for generation</p>
              <div className="provider-options">
                {VISIBLE_PROVIDERS.map((providerKey) => {
                  const info = AI_PROVIDER_INFO[providerKey];
                  return (
                    <button
                      key={providerKey}
                      className={`provider-option ${aiProvider === providerKey ? 'active' : ''}`}
                      onClick={() => setAIProvider(providerKey)}
                    >
                      <span className="provider-name">{info.name}</span>
                      <span className="provider-cost">{info.cost}</span>
                      <span className="provider-desc">{info.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="design-page-sidebar">
          <SelectedItems showClearAll={false} />
          <div className="design-page-generate">
            <GenerateButton />
          </div>
        </aside>
      </div>

      {isGenerating && (
        <LoadingState message={`Generating with ${AI_PROVIDER_INFO[aiProvider].name}...`} />
      )}
    </div>
  );
}
