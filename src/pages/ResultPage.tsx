import { useNavigate } from 'react-router-dom';
import { ResultViewer } from '../components/visualization/ResultViewer';
import { Button } from '../components/ui/Button';
import { useVisualizationStore, useRoomStore, useFurnitureStore } from '../store';
import { AI_PROVIDER_INFO } from '../types/visualization';
import './ResultPage.css';

export function ResultPage() {
  const navigate = useNavigate();
  const { result, reset } = useVisualizationStore();
  const resetRoom = useRoomStore((state) => state.reset);
  const clearFurniture = useFurnitureStore((state) => state.clearItems);

  const handleTryAgain = () => {
    reset();
    navigate('/design');
  };

  const handleStartOver = () => {
    reset();
    resetRoom();
    clearFurniture();
    navigate('/');
  };

  if (!result) {
    return (
      <div className="result-page">
        <div className="result-page-empty">
          <h2>No design generated yet</h2>
          <p>Generate a design to see results here</p>
          <Button variant="primary" onClick={() => navigate('/design')}>
            Go to Design
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-page-header">
        <div>
          <h1 className="result-page-title">Your AI-Generated Design</h1>
          <p className="result-page-provider">
            Generated with {AI_PROVIDER_INFO[result.provider].name}
          </p>
        </div>
        <div className="result-page-actions">
          <Button variant="ghost" onClick={handleStartOver}>
            Start Over
          </Button>
          <Button variant="outline" onClick={handleTryAgain}>
            Try Different Style
          </Button>
        </div>
      </div>

      <div className="result-page-content">
        <section className="result-section">
          <h2 className="result-section-title">Original Room</h2>
          <div className="result-image-container">
            <img
              src={result.originalRoomUrl}
              alt="Original room"
              className="result-image"
            />
          </div>
        </section>

        <section className="result-section">
          <h2 className="result-section-title">AI-Generated Design</h2>
          <ResultViewer
            imageUrl={result.generatedImageUrl}
            onTryAgain={handleTryAgain}
          />
        </section>

        <section className="result-section">
          <h2 className="result-section-title">Furniture Used</h2>
          <div className="result-furniture-list">
            {result.furnitureItems.map((item) => (
              <div key={item.id} className="result-furniture-item">
                <img
                  src={item.thumbnailUrl}
                  alt={item.name}
                  className="result-furniture-image"
                />
                <div className="result-furniture-info">
                  <span className="result-furniture-name">{item.name}</span>
                  <span className="result-furniture-price">${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
