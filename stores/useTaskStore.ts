
import { create } from 'zustand';
import { IdeaNode } from '../types';

interface NodeStore {
  nodes: IdeaNode[];
  setNodes: (nodes: IdeaNode[]) => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: [],
  setNodes: (nodes) => set({ nodes }),
}));
