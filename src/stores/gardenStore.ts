import { create } from 'zustand';
import type { GardenContext } from '@/types';

interface GardenStore {
  gardenId: string | null;
  gardenName: string;
  context: GardenContext;
  setGardenId: (id: string) => void;
  setGardenName: (name: string) => void;
  setContext: (context: Partial<GardenContext>) => void;
  resetGarden: () => void;
}

const defaultContext: GardenContext = {
  location: null,
  climate: {
    zone: 9,
    type: 'mediterranean',
  },
  soil: {
    type: 'loamy',
    ph: 6.5,
    drainage: 'good',
  },
  sunExposure: {
    north: 'sun',
    south: 'sun',
    east: 'sun',
    west: 'sun',
  },
};

export const useGardenStore = create<GardenStore>((set) => ({
  gardenId: null,
  gardenName: 'Untitled Garden',
  context: defaultContext,
  setGardenId: (id) => set({ gardenId: id }),
  setGardenName: (name) => set({ gardenName: name }),
  setContext: (context) =>
    set((state) => ({ context: { ...state.context, ...context } })),
  resetGarden: () =>
    set({
      gardenId: null,
      gardenName: 'Untitled Garden',
      context: defaultContext,
    }),
}));
