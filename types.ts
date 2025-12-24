
export interface Position {
  x: number;
  y: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  position: Position;
  color: string;
  width: number;
  height: number;
  isCollapsed: boolean;
  parentId?: string;
}

export interface ViewState {
  offset: Position;
  scale: number;
}

export interface CanvasState {
  tasks: Task[];
  viewState: ViewState;
  selectedTaskId: string | null;
}
