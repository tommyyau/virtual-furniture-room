import { useState, useEffect } from 'react';
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Generating your room design...' }: LoadingStateProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Prevent scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  return (
    <div className="loading-overlay">
      <div className="loading-modal">
        <div className="loading-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring" />
          <div className="spinner-ring" />
        </div>
        <h2 className="loading-title">Please Wait</h2>
        <p className="loading-message">{message}</p>
        <p className="loading-hint">This typically takes up to 60 seconds. Please do not close or refresh the page.</p>
        <div className="loading-timer">
          <span className="loading-timer-label">Elapsed</span>
          <span className="loading-timer-value">{formatTime(elapsedSeconds)}</span>
        </div>
      </div>
    </div>
  );
}
