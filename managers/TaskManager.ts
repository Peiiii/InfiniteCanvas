
import { useTaskStore } from '../stores/useTaskStore';
import { useCanvasStore } from '../stores/useCanvasStore';
import { Task, Position } from '../types';
import { breakdownTask as breakdownTaskAI } from '../services/geminiService';

export class TaskManager {
  private dragAnchor: { mouse: Position; task: Position } | null = null;

  addTask = (position?: Position) => {
    const { tasks, setTasks } = useTaskStore.getState();
    const { viewState, setSelectedTaskId } = useCanvasStore.getState();
    
    const newId = Math.random().toString(36).substr(2, 9);
    const centerPos = position || {
      x: (window.innerWidth / 2 - viewState.offset.x) / viewState.scale,
      y: (window.innerHeight / 2 - viewState.offset.y) / viewState.scale
    };
    
    const newTask: Task = {
      id: newId,
      title: 'New Idea',
      description: '',
      completed: false,
      isCollapsed: false,
      position: centerPos,
      color: ['blue', 'green', 'purple', 'amber'][Math.floor(Math.random() * 4)],
      width: 320,
      height: 180,
    };
    
    setTasks([...tasks, newTask]);
    setSelectedTaskId(newId);
  };

  updateTask = (id: string, updates: Partial<Task>) => {
    const { tasks, setTasks } = useTaskStore.getState();
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  deleteTask = (id: string) => {
    const { tasks, setTasks } = useTaskStore.getState();
    const { selectedTaskId, setSelectedTaskId } = useCanvasStore.getState();
    setTasks(tasks.filter(t => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  startDragging = (id: string, e: React.MouseEvent) => {
    const { tasks } = useTaskStore.getState();
    const { setDraggingTaskId, setSelectedTaskId } = useCanvasStore.getState();
    const task = tasks.find(t => t.id === id);
    if (task) {
      setDraggingTaskId(id);
      setSelectedTaskId(id);
      this.dragAnchor = {
        mouse: { x: e.clientX, y: e.clientY },
        task: { ...task.position }
      };
    }
  };

  updateDragging = (e: React.MouseEvent) => {
    const { draggingTaskId, viewState } = useCanvasStore.getState();
    if (!draggingTaskId || !this.dragAnchor) return;

    const dx = (e.clientX - this.dragAnchor.mouse.x) / viewState.scale;
    const dy = (e.clientY - this.dragAnchor.mouse.y) / viewState.scale;
    
    this.updateTask(draggingTaskId, {
      position: { x: this.dragAnchor.task.x + dx, y: this.dragAnchor.task.y + dy }
    });
  };

  stopDragging = () => {
    useCanvasStore.getState().setDraggingTaskId(null);
    this.dragAnchor = null;
  };

  handleAIByBreakdown = async (id: string) => {
    const { tasks, setTasks } = useTaskStore.getState();
    const { setIsAIProcessing } = useCanvasStore.getState();
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    setIsAIProcessing(true);
    try {
      // 现在的 AI 逻辑是“思维扩展”
      const subtasks = await breakdownTaskAI(task.title, task.description);
      const newTasks: Task[] = subtasks.map((st: any, index: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: st.title,
        description: st.description,
        completed: false,
        isCollapsed: false,
        position: {
          x: task.position.x + 400,
          y: task.position.y + (index - Math.floor(subtasks.length/2)) * 220
        },
        color: task.color,
        width: 320,
        height: 180,
        parentId: task.id
      }));
      setTasks([...tasks, ...newTasks]);
    } catch (err) {
      alert("AI synthesis failed. Check API key.");
    } finally {
      setIsAIProcessing(false);
    }
  };
}
