
import { create } from 'zustand';
import { ViewState, Position } from '../types';

export type Theme = 'light' | 'dark';

interface CanvasStore {
  viewState: ViewState;
  selectedNodeId: string | null;
  isAIProcessing: boolean;
  draggingNodeId: string | null;
  isPanning: boolean;
  theme: Theme;
  setViewState: (viewState: ViewState | ((prev: ViewState) => ViewState)) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsAIProcessing: (is: boolean) => void;
  setDraggingNodeId: (id: string | null) => void;
  setIsPanning: (is: boolean) => void;
  setTheme: (theme: Theme) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  viewState: {
    offset: { x: 0, y: 0 },
    scale: 1.0
  },
  selectedNodeId: null,
  isAIProcessing: false,
  draggingNodeId: null,
  isPanning: false,
  theme: (localStorage.getItem('infinite-theme') as Theme) || 'light',
  setViewState: (update) => set((state) => ({
    viewState: typeof update === 'function' ? update(state.viewState) : update
  })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setIsAIProcessing: (is) => set({ isAIProcessing: is }),
  setDraggingNodeId: (id) => set({ draggingNodeId: id }),
  setIsPanning: (is) => set({ isPanning: is }),
  setTheme: (theme) => {
    localStorage.setItem('infinite-theme', theme);
    set({ theme });
  },
}));
