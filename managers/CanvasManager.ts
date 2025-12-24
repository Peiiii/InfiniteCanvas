
import { useCanvasStore, Theme } from '../stores/useCanvasStore';
import { Position } from '../types';

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export class CanvasManager {
  private panStartAnchor: Position = { x: 0, y: 0 };

  handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = Math.pow(1.001, delta);
    
    const { viewState, setViewState } = useCanvasStore.getState();
    const newScale = Math.min(Math.max(viewState.scale * factor, MIN_SCALE), MAX_SCALE);
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const worldX = (mouseX - viewState.offset.x) / viewState.scale;
    const worldY = (mouseY - viewState.offset.y) / viewState.scale;

    setViewState({
      scale: newScale,
      offset: { x: mouseX - worldX * newScale, y: mouseY - worldY * newScale }
    });
  };

  startPanning = (e: React.MouseEvent) => {
    const { viewState, setIsPanning, setSelectedTaskId } = useCanvasStore.getState();
    setIsPanning(true);
    setSelectedTaskId(null);
    this.panStartAnchor = { 
      x: e.clientX - viewState.offset.x, 
      y: e.clientY - viewState.offset.y 
    };
  };

  updatePanning = (e: React.MouseEvent) => {
    const { isPanning, setViewState } = useCanvasStore.getState();
    if (!isPanning) return;
    setViewState(prev => ({
      ...prev,
      offset: { x: e.clientX - this.panStartAnchor.x, y: e.clientY - this.panStartAnchor.y }
    }));
  };

  stopPanning = () => {
    useCanvasStore.getState().setIsPanning(false);
  };

  resetView = () => {
    useCanvasStore.getState().setViewState({
      offset: { 
        x: window.innerWidth / 2 - 160, 
        y: window.innerHeight / 2 - 90 
      },
      scale: 1.0
    });
  };

  zoomIn = () => {
    useCanvasStore.getState().setViewState(prev => ({ 
      ...prev, 
      scale: Math.min(prev.scale * 1.2, MAX_SCALE) 
    }));
  };

  zoomOut = () => {
    useCanvasStore.getState().setViewState(prev => ({ 
      ...prev, 
      scale: Math.max(prev.scale / 1.2, MIN_SCALE) 
    }));
  };

  toggleTheme = () => {
    const { theme, setTheme } = useCanvasStore.getState();
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
}
