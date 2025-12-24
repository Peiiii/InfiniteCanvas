
import { create } from 'zustand';
import { ViewState, Position } from '../types';

export type Theme = 'light' | 'dark';

interface CanvasStore {
  viewState: ViewState;
  selectedTaskId: string | null;
  isAIProcessing: boolean;
  draggingTaskId: string | null;
  isPanning: boolean;
  theme: Theme;
  setViewState: (viewState: ViewState | ((prev: ViewState) => ViewState)) => void;
  setSelectedTaskId: (id: string | null) => void;
  setIsAIProcessing: (is: boolean) => void;
  setDraggingTaskId: (id: string | null) => void;
  setIsPanning: (is: boolean) => void;
  setTheme: (theme: Theme) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  viewState: {
    offset: { x: 0, y: 0 },
    scale: 1.0
  },
  selectedTaskId: null,
  isAIProcessing: false,
  draggingTaskId: null,
  isPanning: false,
  theme: (localStorage.getItem('infinite-theme') as Theme) || 'light',
  setViewState: (update) => set((state) => ({
    viewState: typeof update === 'function' ? update(state.viewState) : update
  })),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setIsAIProcessing: (is) => set({ isAIProcessing: is }),
  setDraggingTaskId: (id) => set({ draggingTaskId: id }),
  setIsPanning: (is) => set({ isPanning: is }),
  setTheme: (theme) => {
    localStorage.setItem('infinite-theme', theme);
    set({ theme });
  },
}));
