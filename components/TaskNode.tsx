
import React, { useState, useRef, useEffect, memo } from 'react';
import { Task } from '../types';
import { usePresenter } from '../hooks/usePresenter';
import { useCanvasStore } from '../stores/useCanvasStore';
import { CheckCircle2, Circle, Trash2, Sparkles, X } from 'lucide-react';

interface TaskNodeProps {
  task: Task;
}

export const TaskNode: React.FC<TaskNodeProps> = memo(({ task }) => {
  const presenter = usePresenter();
  const theme = useCanvasStore(state => state.theme);
  const selectedTaskId = useCanvasStore(state => state.selectedTaskId);
  const draggingTaskId = useCanvasStore(state => state.draggingTaskId);
  
  const isSelected = selectedTaskId === task.id;
  const isDragging = draggingTaskId === task.id;
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
      ? '0 0 0 2px #0D99FF, 0 12px 40px -10px rgba(0,0,0,0.2)' 
      : '0 1px 2px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.05)',
  };

  return (
    <div
      className={`absolute bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col group ${isDragging ? 'no-transition cursor-grabbing' : 'transition-transform duration-200 cursor-grab'}`}
      style={containerStyle}
      onMouseDown={(e) => {
        e.stopPropagation(); // 防止触发背景的 startPanning
        if (!isEditing) presenter.taskManager.startDragging(task.id, e);
      }}
    >
      <div className="flex items-center gap-3 h-14 px-5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            presenter.taskManager.updateTask(task.id, { completed: !task.completed });
          }}
          className="shrink-0 transition-transform active:scale-90"
        >
          {task.completed ? (
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
               <CheckCircle2 className="text-white" size={14} />
            </div>
          ) : (
            <div className={`w-5 h-5 rounded-full border-[1.5px] ${isDark ? 'border-white/10 hover:border-white/30' : 'border-slate-200 hover:border-slate-300'}`} />
          )}
        </button>
        
        {isEditing ? (
          <input
            ref={inputRef}
            className={`bg-transparent outline-none flex-grow text-[14px] font-bold text-slate-900 dark:text-slate-100`}
            value={task.title}
            onChange={(e) => presenter.taskManager.updateTask(task.id, { title: e.target.value })}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 
            className={`flex-grow text-[14px] font-bold truncate tracking-tight transition-opacity ${task.completed ? 'opacity-30 line-through' : 'text-slate-900 dark:text-slate-100'}`}
            onDoubleClick={(e) => { 
              e.stopPropagation(); 
              setIsEditing(true); 
            }}
          >
            {task.title || 'Untitled Node'}
          </h3>
        )}

        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-1 translate-x-1 group-hover:translate-x-0">
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); presenter.taskManager.handleAIByBreakdown(task.id); }}
            className={`p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500`}
          >
            <Sparkles size={14} />
          </button>
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); presenter.taskManager.deleteTask(task.id); }}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!task.isCollapsed && (
        <div className="flex flex-col px-5 pb-5 gap-3">
          <textarea
            className={`rounded-xl p-4 text-[13px] leading-relaxed outline-none resize-none h-32 transition-all border ${isDark ? 'bg-black/20 border-white/5 text-slate-400 focus:border-white/10' : 'bg-slate-50 border-slate-100 text-slate-600 focus:border-slate-200'}`}
            placeholder="Write details..."
            value={task.description}
            onChange={(e) => presenter.taskManager.updateTask(task.id, { description: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <button 
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          presenter.taskManager.updateTask(task.id, { isCollapsed: !task.isCollapsed });
        }}
        className={`h-3 w-full flex items-center justify-center transition-colors rounded-b-2xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
      >
        <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
      </button>
    </div>
  );
});
