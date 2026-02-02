import { useRoomStore } from '../../store';
import './PlacementCanvas.css';

export function PlacementCanvas() {
  const roomImage = useRoomStore((state) => state.roomImage);

  if (!roomImage) {
    return (
      <div className="placement-canvas-empty">
        <p>Upload a room photo to get started</p>
      </div>
    );
  }

  return (
    <div className="placement-canvas">
      <img
        src={roomImage.url}
        alt="Room"
        className="placement-canvas-image"
      />
    </div>
  );
}
