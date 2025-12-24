
export interface Position {
  x: number;
  y: number;
}

export interface IdeaNode {
  id: string;
  title: string;
  description: string;
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
  nodes: IdeaNode[];
  viewState: ViewState;
  selectedNodeId: string | null;
}
