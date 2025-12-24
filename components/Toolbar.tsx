
import React from 'react';
import { usePresenter } from '../hooks/usePresenter';
import { useCanvasStore } from '../stores/useCanvasStore';
import { Plus, ZoomIn, ZoomOut, RotateCcw, Moon, Sun } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const presenter = usePresenter();
  const scale = useCanvasStore(state => state.viewState.scale);
  const theme = useCanvasStore(state => state.theme);

  const isDark = theme === 'dark';

  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-2xl border shadow-2xl flex items-center gap-2 z-[100] transition-all ${isDark ? 'bg-[#18181b]/90 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-900'} backdrop-blur-xl`}>
      
      <button 
        onClick={() => presenter.taskManager.addNode()}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[13px] tracking-tight transition-all active:scale-95 shadow-sm ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
      >
        <Plus size={16} strokeWidth={3} />
        <span>Create Idea</span>
      </button>

      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

      <div className="flex items-center gap-0.5">
        <button onClick={presenter.canvasManager.zoomOut} className={`p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-500'} transition-colors`}>
          <ZoomOut size={18} />
        </button>
        <div className={`text-[11px] font-black min-w-[48px] text-center font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {Math.round(scale * 100)}%
        </div>
        <button onClick={presenter.canvasManager.zoomIn} className={`p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-500'} transition-colors`}>
          <ZoomIn size={18} />
        </button>
      </div>

      <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

      <div className="flex items-center gap-1">
        <button 
          onClick={presenter.canvasManager.resetView}
          className={`p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 ${isDark ? 'text-slate-400' : 'text-slate-500'} transition-colors`}
          title="Recenter World"
        >
          <RotateCcw size={18} />
        </button>
        <button 
          onClick={presenter.canvasManager.toggleTheme}
          className={`p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all ${isDark ? 'text-amber-400' : 'text-blue-600'}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};
