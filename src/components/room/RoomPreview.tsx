import { Button } from '../ui/Button';
import { useRoomStore } from '../../store';
import './RoomPreview.css';

interface RoomPreviewProps {
  showClearButton?: boolean;
}

export function RoomPreview({ showClearButton = true }: RoomPreviewProps) {
  const { roomImage, setRoomImage } = useRoomStore();

  if (!roomImage) {
    return null;
  }

  const handleClear = () => {
    if (roomImage.url.startsWith('blob:')) {
      URL.revokeObjectURL(roomImage.url);
    }
    setRoomImage(null);
  };

  return (
    <div className="room-preview">
      <div className="room-preview-image-container">
        <img
          src={roomImage.url}
          alt="Room preview"
          className="room-preview-image"
        />
        <div className="room-preview-dimensions">
          {roomImage.width} x {roomImage.height}
        </div>
      </div>
      {showClearButton && (
        <div className="room-preview-actions">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Remove photo
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Change photo
          </Button>
        </div>
      )}
    </div>
  );
}
