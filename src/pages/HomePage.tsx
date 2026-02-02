import { useNavigate } from 'react-router-dom';
import { RoomUploader } from '../components/room/RoomUploader';
import { RoomPreview } from '../components/room/RoomPreview';
import { Button } from '../components/ui/Button';
import { useRoomStore } from '../store';
import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const roomImage = useRoomStore((state) => state.roomImage);

  const handleContinue = () => {
    navigate('/catalog');
  };

  return (
    <div className="home-page">
      <div className="home-page-header">
        <h1 className="home-page-title">AI Room Designer</h1>
        <p className="home-page-subtitle">
          Upload a photo of your room and see how new furniture looks before you buy
        </p>
      </div>

      <div className="home-page-content">
        {roomImage ? (
          <div className="home-page-preview">
            <RoomPreview />
            <Button variant="primary" size="lg" onClick={handleContinue}>
              Continue to Furniture Selection
            </Button>
          </div>
        ) : (
          <RoomUploader />
        )}
      </div>

      <div className="home-page-features">
        <div className="feature">
          <div className="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h3>Upload Room Photo</h3>
          <p>Take a photo of your room or upload an existing one</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <rect x="4" y="3" width="16" height="10" rx="2" />
            </svg>
          </div>
          <h3>Select Furniture</h3>
          <p>Browse IKEA catalog and pick items you want to visualize</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h3>AI Generation</h3>
          <p>Our AI places furniture realistically in your room</p>
        </div>
      </div>
    </div>
  );
}
