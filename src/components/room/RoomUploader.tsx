import { useCallback, useRef } from 'react';
import { FileUpload } from '../ui/FileUpload';
import { Button } from '../ui/Button';
import { useRoomStore } from '../../store';
import './RoomUploader.css';

interface RoomUploaderProps {
  onUploadComplete?: () => void;
}

export function RoomUploader({ onUploadComplete }: RoomUploaderProps) {
  const setRoomImage = useRoomStore((state) => state.setRoomImage);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setRoomImage({
          id: crypto.randomUUID(),
          url,
          file,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        onUploadComplete?.();
      };
      img.src = url;
    },
    [setRoomImage, onUploadComplete]
  );

  const handleCameraCapture = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const handleCameraInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  return (
    <div className="room-uploader">
      <FileUpload onFileSelect={handleFileSelect}>
        <div className="room-uploader-content">
          <div className="room-uploader-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h3 className="room-uploader-title">Upload your room photo</h3>
          <p className="room-uploader-text">
            Drag and drop an image of your room, or click to browse
          </p>
          <p className="room-uploader-hint">Supports JPG, PNG, WEBP up to 10MB</p>
        </div>
      </FileUpload>

      <div className="room-uploader-divider">
        <span>or</span>
      </div>

      <Button variant="outline" onClick={handleCameraCapture} className="camera-button">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Take a photo
      </Button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInput}
        className="camera-input"
      />
    </div>
  );
}
