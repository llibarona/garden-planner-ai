import { create } from 'zustand';
import type { Plant } from '@/types';
import { plants as initialPlants } from '@/data/plants';

interface PlantStore {
  plants: Plant[];
  setPlants: (plants: Plant[]) => void;
  addPlant: (plant: Plant) => void;
  updatePlant: (id: string, updates: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  getPlantById: (id: string) => Plant | undefined;
}

export const usePlantStore = create<PlantStore>((set, get) => ({
  plants: initialPlants,
  setPlants: (plants) => set({ plants }),
  addPlant: (plant) => set((state) => ({ plants: [...state.plants, plant] })),
  updatePlant: (id, updates) =>
    set((state) => ({
      plants: state.plants.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deletePlant: (id) =>
    set((state) => ({ plants: state.plants.filter((p) => p.id !== id) })),
  getPlantById: (id) => get().plants.find((p) => p.id === id),
}));
