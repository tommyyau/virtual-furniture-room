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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="loading-message">{message}</p>
      <p className="loading-hint">This typically takes 30-60 seconds</p>
      <p className="loading-elapsed">Elapsed: {formatTime(elapsedSeconds)}</p>
    </div>
  );
}
