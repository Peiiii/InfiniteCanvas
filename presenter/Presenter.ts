
import { CanvasManager } from '../managers/CanvasManager';
import { TaskManager } from '../managers/TaskManager';

export class Presenter {
  canvasManager: CanvasManager;
  taskManager: TaskManager;

  constructor() {
    this.canvasManager = new CanvasManager();
    this.taskManager = new TaskManager();
  }

  // 可根据需要添加全局通信能力
  initFromStorage = () => {
    const saved = localStorage.getItem('infinite-canvas-tasks');
    if (saved) {
      try {
        const tasks = JSON.parse(saved);
        return tasks;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  saveToStorage = (tasks: any) => {
    localStorage.setItem('infinite-canvas-tasks', JSON.stringify(tasks));
  };
}

export const presenterInstance = new Presenter();
