
import React, { useEffect, useRef } from 'react';
import { PresenterProvider } from './context/PresenterContext';
import { usePresenter } from './hooks/usePresenter';
import { useNodeStore } from './stores/useTaskStore';
import { useCanvasStore } from './stores/useCanvasStore';
import { TaskNode } from './components/TaskNode';
import { Toolbar } from './components/Toolbar';
import { Loader2 } from 'lucide-react';

function Grid() {
  const theme = useCanvasStore(state => state.theme);
  const isDark = theme === 'dark';
  
  const dotColor = isDark ? '#262626' : '#d1d5db'; 
  const crossColor = isDark ? '#404040' : '#9ca3af';

  return (
    <svg className="grid-svg">
      <defs>
        <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={dotColor} />
        </pattern>
        
        <pattern id="mainGrid" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="url(#dotGrid)" />
          <path 
            d="M 0 5 L 0 -5 M -5 0 L 5 0" 
            fill="none" 
            stroke={crossColor} 
            strokeWidth="1.2" 
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mainGrid)" />
    </svg>
  );
}

function Canvas() {
  const presenter = usePresenter();
  const nodes = useNodeStore(state => state.nodes);
  const setNodes = useNodeStore(state => state.setNodes);
  const viewState = useCanvasStore(state => state.viewState);
  const theme = useCanvasStore(state => state.theme);
  const isAIProcessing = useCanvasStore(state => state.isAIProcessing);
  const draggingNodeId = useCanvasStore(state => state.draggingNodeId);
  const isPanning = useCanvasStore(state => state.isPanning);
  const setViewState = useCanvasStore(state => state.setViewState);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const saved = presenter.initFromStorage();
    const centerX = window.innerWidth / 2 - 160;
    const centerY = window.innerHeight / 2 - 90;
    
    setViewState(prev => ({
      ...prev,
      offset: { x: centerX, y: centerY }
    }));

    if (saved && saved.length > 0) {
      setNodes(saved);
    } else {
      setNodes([{
        id: '1',
        title: 'The Aether Canvas',
        description: 'Think without borders. Explore without limits.\n\n• Double-click anywhere to create a new fragment\n• Use the ✦ icon to expand a seed into branches\n• Space + Drag to move the world\n• Command/Ctrl + Scroll to navigate depth',
        isCollapsed: false,
        position: { x: 0, y: 0 },
        color: 'blue',
        width: 340,
        height: 180,
      }]);
    }
  }, [presenter, setNodes, setViewState]);

  useEffect(() => {
    if (nodes.length > 0) {
      presenter.saveToStorage(nodes);
    }
  }, [nodes, presenter]);

  const handleMouseMove = (e: React.MouseEvent) => {
    presenter.canvasManager.updatePanning(e);
    presenter.taskManager.updateDragging(e);
  };

  const handleMouseUp = () => {
    presenter.canvasManager.stopPanning();
    presenter.taskManager.stopDragging();
  };

  return (
    <div 
      className={`canvas-container select-none ${isDark ? 'dark' : ''} ${draggingNodeId || isPanning ? 'dragging-active' : ''}`} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp}
    >
      <Grid />

      <div 
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        onWheel={presenter.canvasManager.handleWheel}
        onMouseDown={presenter.canvasManager.startPanning}
        onDoubleClick={(e) => {
           if (e.target === containerRef.current) {
             const x = (e.clientX - viewState.offset.x) / viewState.scale;
             const y = (e.clientY - viewState.offset.y) / viewState.scale;
             presenter.taskManager.addNode({ x, y });
           }
        }}
      />

      <div 
        className={`world-space absolute ${draggingNodeId || isPanning ? 'no-transition' : ''}`} 
        style={{ 
          transform: `translate3d(${viewState.offset.x}px, ${viewState.offset.y}px, 0) scale(${viewState.scale})`, 
          transformOrigin: '0 0' 
        }}
      >
        {nodes.map(node => (
          <div key={node.id} className="pointer-events-auto absolute">
            <TaskNode task={node} />
          </div>
        ))}
      </div>

      <div className="absolute top-8 left-10 pointer-events-none z-30 flex items-center gap-3">
        <div className={`text-[13px] font-black tracking-[0.25em] uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
          AETHER
        </div>
        <div className={`w-px h-3 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
        <div className={`text-[11px] font-medium tracking-widest uppercase opacity-40 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Infinite Synthesis
        </div>
      </div>

      {isAIProcessing && (
        <div className={`fixed top-8 right-8 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3 shadow-xl z-[100] bg-white dark:bg-[#18181b] animate-in fade-in zoom-in duration-300`}>
          <Loader2 className="animate-spin text-blue-500" size={14} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Synthesizing</span>
        </div>
      )}

      <Toolbar />
    </div>
  );
}

export default function App() {
  return (
    <PresenterProvider>
      <Canvas />
    </PresenterProvider>
  );
}
