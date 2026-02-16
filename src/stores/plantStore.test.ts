import { describe, it, expect, beforeEach } from 'vitest';
import { usePlantStore } from './plantStore';
import type { Plant } from '@/types';

const mockPlant: Plant = {
  id: 'test-plant',
  commonName: 'Test Plant',
  scientificName: 'Plantus testus',
  category: 'flower',
  regions: ['europe'],
  size: { width: 50, height: 50, unit: 'cm' },
  growthRate: 'medium',
  hardinessZone: { min: 5, max: 9 },
  sunlight: 'full-sun',
  temperature: { min: 15, max: 25, unit: 'celsius' },
  soil: {
    type: 'loamy',
    ph: { min: 6.0, max: 7.0 },
    drainage: 'good',
  },
  water: { needs: 'medium', frequency: 'weekly' },
  companionPlants: [],
  incompatiblePlants: [],
  additionalInfo: [],
};

describe('usePlantStore', () => {
  beforeEach(() => {
    usePlantStore.setState({ plants: [] });
  });

  it('should add a plant', () => {
    const { addPlant } = usePlantStore.getState();
    addPlant(mockPlant);
    
    const plants = usePlantStore.getState().plants;
    expect(plants).toHaveLength(1);
    expect(plants[0].commonName).toBe('Test Plant');
  });

  it('should update a plant', () => {
    const { addPlant, updatePlant } = usePlantStore.getState();
    addPlant(mockPlant);
    
    updatePlant('test-plant', { commonName: 'Updated Plant' });
    
    const plants = usePlantStore.getState().plants;
    expect(plants[0].commonName).toBe('Updated Plant');
  });

  it('should delete a plant', () => {
    const { addPlant, deletePlant } = usePlantStore.getState();
    addPlant(mockPlant);
    
    deletePlant('test-plant');
    
    const plants = usePlantStore.getState().plants;
    expect(plants).toHaveLength(0);
  });

  it('should get plant by id', () => {
    const { addPlant, getPlantById } = usePlantStore.getState();
    addPlant(mockPlant);
    
    const plant = getPlantById('test-plant');
    expect(plant?.commonName).toBe('Test Plant');
  });

  it('should return undefined for non-existent plant', () => {
    const { getPlantById } = usePlantStore.getState();
    const plant = getPlantById('non-existent');
    expect(plant).toBeUndefined();
  });
});
