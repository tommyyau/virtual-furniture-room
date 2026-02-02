import { create } from 'zustand';
import type { VisualizationResult, GenerationStatus } from '../types';

interface VisualizationState {
  status: GenerationStatus;
  result: VisualizationResult | null;
  error: string | null;
  setStatus: (status: GenerationStatus) => void;
  setResult: (result: VisualizationResult | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVisualizationStore = create<VisualizationState>((set) => ({
  status: 'idle',
  result: null,
  error: null,
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result, status: result ? 'complete' : 'idle' }),
  setError: (error) => set({ error, status: error ? 'error' : 'idle' }),
  reset: () => set({ status: 'idle', result: null, error: null }),
}));
