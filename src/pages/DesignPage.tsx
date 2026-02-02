import { useNavigate } from 'react-router-dom';
import { RoomPreview } from '../components/room/RoomPreview';
import { SelectedItems } from '../components/furniture/SelectedItems';
import { GenerateButton } from '../components/visualization/GenerateButton';
import { LoadingState } from '../components/visualization/LoadingState';
import { Button } from '../components/ui/Button';
import { useRoomStore, useFurnitureStore, useVisualizationStore } from '../store';
import { ROOM_TYPE_LABELS, DESIGN_STYLE_LABELS } from '../types/room';
import { AI_PROVIDER_INFO } from '../types/visualization';
import type { RoomType, DesignStyle, AIProvider } from '../types';
import './DesignPage.css';

export function DesignPage() {
  const navigate = useNavigate();
  const { roomImage, roomType, designStyle, aiProvider, setRoomType, setDesignStyle, setAIProvider } = useRoomStore();
  const selectedItems = useFurnitureStore((state) => state.selectedItems);
  const { status, error } = useVisualizationStore();

  const handleBack = () => {
    navigate('/catalog');
  };

  if (status === 'generating' || status === 'uploading') {
    return (
      <div className="design-page">
        <LoadingState message={`Generating with ${AI_PROVIDER_INFO[aiProvider].name}...`} />
      </div>
    );
  }

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

          <div className="design-section">
            <h2 className="design-section-title">AI Provider</h2>
            <p className="design-section-hint">Choose which AI service to use for generation</p>
            <div className="provider-options">
              {(Object.entries(AI_PROVIDER_INFO) as [AIProvider, typeof AI_PROVIDER_INFO[AIProvider]][]).map(
                ([value, info]) => (
                  <button
                    key={value}
                    className={`provider-option ${aiProvider === value ? 'active' : ''}`}
                    onClick={() => setAIProvider(value)}
                  >
                    <span className="provider-name">{info.name}</span>
                    <span className="provider-cost">{info.cost}</span>
                    <span className="provider-desc">{info.description}</span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="design-section">
            <h2 className="design-section-title">Room Type</h2>
            <div className="design-options">
              {(Object.entries(ROOM_TYPE_LABELS) as [RoomType, string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    className={`design-option ${roomType === value ? 'active' : ''}`}
                    onClick={() => setRoomType(value)}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="design-section">
            <h2 className="design-section-title">Design Style</h2>
            <div className="design-options">
              {(Object.entries(DESIGN_STYLE_LABELS) as [DesignStyle, string][]).map(
                ([value, label]) => (
                  <button
                    key={value}
                    className={`design-option ${designStyle === value ? 'active' : ''}`}
                    onClick={() => setDesignStyle(value)}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <aside className="design-page-sidebar">
          <SelectedItems showClearAll={false} />
          <div className="design-page-generate">
            <GenerateButton />
          </div>
        </aside>
      </div>
    </div>
  );
}
