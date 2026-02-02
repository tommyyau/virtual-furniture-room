import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Generating your room design...' }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <div className="loading-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="loading-message">{message}</p>
      <p className="loading-hint">This may take 15-30 seconds</p>
    </div>
  );
}
