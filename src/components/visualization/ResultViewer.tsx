import { Button } from '../ui/Button';
import './ResultViewer.css';

interface ResultViewerProps {
  imageUrl: string;
  onDownload?: () => void;
  onTryAgain?: () => void;
}

export function ResultViewer({ imageUrl, onDownload, onTryAgain }: ResultViewerProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `room-design-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onDownload?.();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="result-viewer">
      <div className="result-viewer-image-container">
        <img src={imageUrl} alt="Generated room design" className="result-viewer-image" />
      </div>
      <div className="result-viewer-actions">
        <Button variant="primary" onClick={handleDownload}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Image
        </Button>
        {onTryAgain && (
          <Button variant="outline" onClick={onTryAgain}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Generate Again
          </Button>
        )}
      </div>
    </div>
  );
}
