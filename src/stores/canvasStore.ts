import { create } from 'zustand';
import type { Tool, Layer, LayerType, PlacedPlant, TerrainShape, PlacedObstacle } from '@/types';

interface CanvasStore {
  tool: Tool;
  zoom: number;
  panOffset: { x: number; y: number };
  selectedElementId: string | null;
  layers: Layer[];
  plants: PlacedPlant[];
  terrain: TerrainShape | null;
  obstacles: PlacedObstacle[];
  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setSelectedElementId: (id: string | null) => void;
  toggleLayerVisibility: (layerId: LayerType) => void;
  toggleLayerLock: (layerId: LayerType) => void;
  addPlant: (plant: PlacedPlant) => void;
  removePlant: (id: string) => void;
  updatePlant: (id: string, updates: Partial<PlacedPlant>) => void;
  duplicatePlant: (id: string, offset?: { x: number; y: number }) => string | null;
  setTerrain: (terrain: TerrainShape | null) => void;
  addObstacle: (obstacle: PlacedObstacle) => void;
  removeObstacle: (id: string) => void;
  updateObstacle: (id: string, updates: Partial<PlacedObstacle>) => void;
  duplicateObstacle: (id: string, offset?: { x: number; y: number }) => string | null;
}

const defaultLayers: Layer[] = [
  { id: 'base', name: 'Base', visible: true, locked: false, zIndex: 0 },
  { id: 'soil', name: 'Soil', visible: true, locked: false, zIndex: 10 },
  { id: 'plants', name: 'Plants', visible: true, locked: false, zIndex: 20 },
  { id: 'infrastructure', name: 'Infrastructure', visible: true, locked: false, zIndex: 30 },
  { id: 'annotations', name: 'Annotations', visible: true, locked: false, zIndex: 40 },
];

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  tool: 'select',
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  selectedElementId: null,
  layers: defaultLayers,
  plants: [],
  terrain: null,
  obstacles: [],
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    })),
  toggleLayerLock: (layerId) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      ),
    })),
  setTerrain: (terrain) => set({ terrain }),
  addPlant: (plant) => set((state) => ({ plants: [...state.plants, plant] })),
  removePlant: (id) => set((state) => ({ plants: state.plants.filter((p) => p.instanceId !== id) })),
  updatePlant: (id, updates) =>
    set((state) => ({
      plants: state.plants.map((p) => (p.instanceId === id ? { ...p, ...updates } : p)),
    })),
  duplicatePlant: (id, offset = { x: 30, y: 30 }) => {
    const state = get();
    const plant = state.plants.find((p) => p.instanceId === id);
    if (!plant) return null;
    const newInstanceId = `${plant.id}-${Date.now()}`;
    const newPlant: PlacedPlant = {
      ...plant,
      instanceId: newInstanceId,
      position: { x: plant.position.x + offset.x, y: plant.position.y + offset.y },
    };
    set({ plants: [...state.plants, newPlant], selectedElementId: newInstanceId });
    return newInstanceId;
  },
  addObstacle: (obstacle) => set((state) => ({ obstacles: [...state.obstacles, obstacle] })),
  removeObstacle: (id) => set((state) => ({ obstacles: state.obstacles.filter((o) => o.instanceId !== id) })),
  updateObstacle: (id, updates) =>
    set((state) => ({
      obstacles: state.obstacles.map((o) => (o.instanceId === id ? { ...o, ...updates } : o)),
    })),
  duplicateObstacle: (id, offset = { x: 30, y: 30 }) => {
    const state = get();
    const obstacle = state.obstacles.find((o) => o.instanceId === id);
    if (!obstacle) return null;
    const newInstanceId = `${obstacle.type}-${Date.now()}`;
    const newObstacle: PlacedObstacle = {
      ...obstacle,
      instanceId: newInstanceId,
      position: { x: obstacle.position.x + offset.x, y: obstacle.position.y + offset.y },
    };
    set({ obstacles: [...state.obstacles, newObstacle], selectedElementId: newInstanceId });
    return newInstanceId;
  },
}));
