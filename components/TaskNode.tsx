
import React, { useState, useRef, useEffect, memo } from 'react';
import { IdeaNode } from '../types';
import { usePresenter } from '../hooks/usePresenter';
import { useCanvasStore } from '../stores/useCanvasStore';
import { Sparkles, X, ChevronDown, ChevronRight, Maximize2 } from 'lucide-react';

interface IdeaNodeProps {
  task: IdeaNode;
}

export const TaskNode: React.FC<IdeaNodeProps> = memo(({ task }) => {
  const presenter = usePresenter();
  const theme = useCanvasStore(state => state.theme);
  const selectedNodeId = useCanvasStore(state => state.selectedNodeId);
  const draggingNodeId = useCanvasStore(state => state.draggingNodeId);
  
  const isSelected = selectedNodeId === task.id;
  const isDragging = draggingNodeId === task.id;
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const isDark = theme === 'dark';

  const containerStyle: React.CSSProperties = {
    transform: `translate3d(${task.position.x}px, ${task.position.y}px, 0)`,
    width: task.width,
    zIndex: isSelected ? 50 : 10,
    boxShadow: isSelected 
      ? '0 0 0 2px #0D99FF, 0 20px 50px -12px rgba(0,0,0,0.3)' 
      : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  };

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    presenter.taskManager.updateNode(task.id, { isCollapsed: !task.isCollapsed });
  };

  return (
    <div
      className={`absolute bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col group overflow-hidden transition-all duration-200 ${isDragging ? 'no-transition cursor-grabbing scale-[1.02]' : 'cursor-grab'}`}
      style={containerStyle}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (!isEditing) presenter.taskManager.startDragging(task.id, e);
      }}
    >
      <div className="flex items-center gap-2 h-12 px-4 shrink-0 bg-slate-50/50 dark:bg-white/[0.02]">
        <button
          onClick={handleToggleCollapse}
          className={`p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        >
          {task.isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {isEditing ? (
          <input
            ref={inputRef}
            className={`bg-transparent outline-none flex-grow text-[13px] font-semibold text-slate-900 dark:text-slate-100`}
            value={task.title}
            onChange={(e) => presenter.taskManager.updateNode(task.id, { title: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 
            className={`flex-grow text-[13px] font-semibold truncate tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
            onDoubleClick={(e) => { 
              e.stopPropagation(); 
              setIsEditing(true); 
            }}
          >
            {task.title || 'Untitled'}
          </h3>
        )}

        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-0.5">
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); presenter.taskManager.handleAIExpansion(task.id); }}
            className={`p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500 transition-colors`}
            title="Expand with AI"
          >
            <Sparkles size={14} />
          </button>
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); presenter.taskManager.deleteNode(task.id); }}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!task.isCollapsed && (
        <div className="flex flex-col p-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <textarea
            className={`rounded-xl p-3 text-[13px] leading-relaxed outline-none resize-none h-28 transition-all border ${isDark ? 'bg-black/20 border-white/5 text-slate-400 focus:border-white/10' : 'bg-white border-slate-100 text-slate-600 focus:border-slate-200 focus:shadow-sm'}`}
            placeholder="Type your notes or thoughts..."
            value={task.description}
            onChange={(e) => presenter.taskManager.updateNode(task.id, { description: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      {task.isCollapsed && (
         <div className="h-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent opacity-20" />
      )}
    </div>
  );
});
