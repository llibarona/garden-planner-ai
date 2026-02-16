import { create } from 'zustand';
import type { AppConfig } from '@/types';

interface ConfigStore {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
}

const defaultConfig: AppConfig = {
  ai: {
    provider: 'rule-based',
  },
  display: {
    unit: 'metric',
    gridSize: 50,
    showGrid: true,
    showRulers: false,
    theme: 'light',
  },
  canvas: {
    defaultWidth: 1000,
    defaultHeight: 1000,
  },
};

export const useConfigStore = create<ConfigStore>((set) => ({
  config: defaultConfig,
  updateConfig: (updates) =>
    set((state) => ({ config: { ...state.config, ...updates } })),
}));
