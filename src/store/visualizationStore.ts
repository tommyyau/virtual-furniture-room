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
  setError: (error) => set((state) => ({
    error,
    // Only change status if setting an error, not when clearing it
    status: error ? 'error' : state.status
  })),
  reset: () => set({ status: 'idle', result: null, error: null }),
}));
