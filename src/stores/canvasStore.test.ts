import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from './canvasStore';
import type { PlacedPlant, TerrainShape } from '@/types';

const mockPlacedPlant: PlacedPlant = {
  id: 'tomato',
  commonName: 'Tomato',
  scientificName: 'Solanum lycopersicum',
  category: 'root',
  regions: ['europe'],
  size: { width: 60, height: 120, unit: 'cm' },
  growthRate: 'fast',
  hardinessZone: { min: 3, max: 11 },
  sunlight: 'full-sun',
  temperature: { min: 15, max: 30, unit: 'celsius' },
  soil: {
    type: 'loamy',
    ph: { min: 6.0, max: 6.8 },
    drainage: 'good',
  },
  water: { needs: 'medium', frequency: 'regular' },
  companionPlants: ['basil'],
  incompatiblePlants: ['cabbage'],
  additionalInfo: [],
  instanceId: 'tomato-1',
  position: { x: 100, y: 200 },
  rotation: 0,
  scale: 1,
};

const mockTerrain: TerrainShape = {
  id: 'terrain-1',
  type: 'rectangle',
  position: { x: 0, y: 0 },
  size: { width: 1000, height: 1000 },
};

describe('useCanvasStore', () => {
  beforeEach(() => {
    useCanvasStore.setState({
      plants: [],
      terrain: null,
      selectedElementId: null,
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      tool: 'select',
    });
  });

  it('should add a plant', () => {
    const { addPlant } = useCanvasStore.getState();
    addPlant(mockPlacedPlant);
    
    const plants = useCanvasStore.getState().plants;
    expect(plants).toHaveLength(1);
    expect(plants[0].instanceId).toBe('tomato-1');
  });

  it('should remove a plant', () => {
    const { addPlant, removePlant } = useCanvasStore.getState();
    addPlant(mockPlacedPlant);
    
    removePlant('tomato-1');
    
    const plants = useCanvasStore.getState().plants;
    expect(plants).toHaveLength(0);
  });

  it('should update a plant', () => {
    const { addPlant, updatePlant } = useCanvasStore.getState();
    addPlant(mockPlacedPlant);
    
    updatePlant('tomato-1', { position: { x: 300, y: 400 } });
    
    const plants = useCanvasStore.getState().plants;
    expect(plants[0].position).toEqual({ x: 300, y: 400 });
  });

  it('should set terrain', () => {
    const { setTerrain } = useCanvasStore.getState();
    setTerrain(mockTerrain);
    
    const terrain = useCanvasStore.getState().terrain;
    expect(terrain?.type).toBe('rectangle');
    expect(terrain?.size.width).toBe(1000);
  });

  it('should clamp zoom between 0.25 and 4', () => {
    const { setZoom } = useCanvasStore.getState();
    
    setZoom(10);
    expect(useCanvasStore.getState().zoom).toBe(4);
    
    setZoom(0.1);
    expect(useCanvasStore.getState().zoom).toBe(0.25);
  });

  it('should set selected element', () => {
    const { setSelectedElementId } = useCanvasStore.getState();
    
    setSelectedElementId('tomato-1');
    expect(useCanvasStore.getState().selectedElementId).toBe('tomato-1');
    
    setSelectedElementId(null);
    expect(useCanvasStore.getState().selectedElementId).toBeNull();
  });

  it('should toggle layer visibility', () => {
    const { toggleLayerVisibility } = useCanvasStore.getState();
    
    toggleLayerVisibility('plants');
    
    const plantsLayer = useCanvasStore.getState().layers.find(l => l.id === 'plants');
    expect(plantsLayer?.visible).toBe(false);
  });

  it('should set tool', () => {
    const { setTool } = useCanvasStore.getState();
    
    setTool('pan');
    expect(useCanvasStore.getState().tool).toBe('pan');
    
    setTool('add-plant');
    expect(useCanvasStore.getState().tool).toBe('add-plant');
  });
});
