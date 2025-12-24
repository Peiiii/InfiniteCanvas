
import { create } from 'zustand';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
