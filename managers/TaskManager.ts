
import { useNodeStore } from '../stores/useTaskStore';
import { useCanvasStore } from '../stores/useCanvasStore';
import { IdeaNode, Position } from '../types';
import { expandIdea as expandIdeaAI } from '../services/geminiService';

// Renamed NodeManager to TaskManager to fix import error in Presenter.ts
export class TaskManager {
  private dragAnchor: { mouse: Position; task: Position } | null = null;

  addNode = (position?: Position) => {
    const { nodes, setNodes } = useNodeStore.getState();
    const { viewState, setSelectedNodeId } = useCanvasStore.getState();
    
    const newId = Math.random().toString(36).substr(2, 9);
    const centerPos = position || {
      x: (window.innerWidth / 2 - viewState.offset.x) / viewState.scale,
      y: (window.innerHeight / 2 - viewState.offset.y) / viewState.scale
    };
    
    const newNode: IdeaNode = {
      id: newId,
      title: 'New Idea',
      description: '',
      isCollapsed: false,
      position: centerPos,
      color: ['blue', 'purple', 'emerald', 'rose'][Math.floor(Math.random() * 4)],
      width: 320,
      height: 180,
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newId);
  };

  updateNode = (id: string, updates: Partial<IdeaNode>) => {
    const { nodes, setNodes } = useNodeStore.getState();
    setNodes(nodes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  deleteNode = (id: string) => {
    const { nodes, setNodes } = useNodeStore.getState();
    const { selectedNodeId, setSelectedNodeId } = useCanvasStore.getState();
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  startDragging = (id: string, e: React.MouseEvent) => {
    const { nodes } = useNodeStore.getState();
    const { setDraggingNodeId, setSelectedNodeId } = useCanvasStore.getState();
    const node = nodes.find(n => n.id === id);
    if (node) {
      setDraggingNodeId(id);
      setSelectedNodeId(id);
      this.dragAnchor = {
        mouse: { x: e.clientX, y: e.clientY },
        task: { ...node.position }
      };
    }
  };

  updateDragging = (e: React.MouseEvent) => {
    const { draggingNodeId, viewState } = useCanvasStore.getState();
    if (!draggingNodeId || !this.dragAnchor) return;

    const dx = (e.clientX - this.dragAnchor.mouse.x) / viewState.scale;
    const dy = (e.clientY - this.dragAnchor.mouse.y) / viewState.scale;
    
    this.updateNode(draggingNodeId, {
      position: { x: this.dragAnchor.task.x + dx, y: this.dragAnchor.task.y + dy }
    });
  };

  stopDragging = () => {
    useCanvasStore.getState().setDraggingNodeId(null);
    this.dragAnchor = null;
  };

  handleAIExpansion = async (id: string) => {
    const { nodes, setNodes } = useNodeStore.getState();
    const { setIsAIProcessing } = useCanvasStore.getState();
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    setIsAIProcessing(true);
    try {
      const branches = await expandIdeaAI(node.title, node.description);
      const newNodes: IdeaNode[] = branches.map((st: any, index: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: st.title,
        description: st.description,
        isCollapsed: false,
        position: {
          x: node.position.x + 400,
          y: node.position.y + (index - Math.floor(branches.length/2)) * 220
        },
        color: node.color,
        width: 320,
        height: 180,
        parentId: node.id
      }));
      setNodes([...nodes, ...newNodes]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAIProcessing(false);
    }
  };
}
