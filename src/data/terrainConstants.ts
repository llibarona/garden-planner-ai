import type { 
  TerrainOrientation, 
  PrecipitationLevel, 
  ObstacleType,
  GardenTemplate,
} from '@/types';

export interface OptionVisual {
  label: string;
  color: string;
  bgColor: string;
  icon?: string;
}

export const TERRAIN_ORIENTATIONS: TerrainOrientation[] = [
  'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW',
];

export const ORIENTATION_VISUALS: Record<TerrainOrientation, OptionVisual> = {
  N: { label: 'North', color: '#1e40af', bgColor: '#dbeafe', icon: 'N' },
  S: { label: 'South', color: '#b45309', bgColor: '#fef3c7', icon: 'S' },
  E: { label: 'East', color: '#047857', bgColor: '#d1fae5', icon: 'E' },
  W: { label: 'West', color: '#7c3aed', bgColor: '#ede9fe', icon: 'W' },
  NE: { label: 'Northeast', color: '#0891b2', bgColor: '#cffafe', icon: 'NE' },
  NW: { label: 'Northwest', color: '#4f46e5', bgColor: '#e0e7ff', icon: 'NW' },
  SE: { label: 'Southeast', color: '#059669', bgColor: '#d1fae5', icon: 'SE' },
  SW: { label: 'Southwest', color: '#d97706', bgColor: '#fef3c7', icon: 'SW' },
};

export const PRECIPITATION_LEVELS: PrecipitationLevel[] = [
  'low', 'medium', 'high',
];

export const PRECIPITATION_VISUALS: Record<PrecipitationLevel, OptionVisual> = {
  low: { label: 'Low (<500mm)', color: '#dc2626', bgColor: '#fee2e2', icon: 'L' },
  medium: { label: 'Medium (500-1000mm)', color: '#ca8a04', bgColor: '#fef9c3', icon: 'M' },
  high: { label: 'High (>1000mm)', color: '#2563eb', bgColor: '#dbeafe', icon: 'H' },
};

export const OBSTACLE_TYPES: ObstacleType[] = [
  'tree', 'rock', 'shed', 'fence', 'pond', 'well', 'path', 'wall', 'house',
];

export interface ObstacleVisual {
  label: string;
  color: string;
  bgColor: string;
  shape: 'circle' | 'rectangle' | 'ellipse';
  defaultWidth: number;
  defaultHeight: number;
}

export const OBSTACLE_VISUALS: Record<ObstacleType, ObstacleVisual> = {
  tree: { 
    label: 'Tree', 
    color: '#166534', 
    bgColor: '#dcfce7', 
    shape: 'circle',
    defaultWidth: 3,
    defaultHeight: 3,
  },
  rock: { 
    label: 'Rock', 
    color: '#57534e', 
    bgColor: '#f5f5f4', 
    shape: 'circle',
    defaultWidth: 1,
    defaultHeight: 1,
  },
  shed: { 
    label: 'Shed', 
    color: '#92400e', 
    bgColor: '#fef3c7', 
    shape: 'rectangle',
    defaultWidth: 4,
    defaultHeight: 3,
  },
  fence: { 
    label: 'Fence', 
    color: '#a16207', 
    bgColor: '#fef9c3', 
    shape: 'rectangle',
    defaultWidth: 5,
    defaultHeight: 0.2,
  },
  pond: { 
    label: 'Pond', 
    color: '#0ea5e9', 
    bgColor: '#e0f2fe', 
    shape: 'ellipse',
    defaultWidth: 4,
    defaultHeight: 2,
  },
  well: { 
    label: 'Well', 
    color: '#64748b', 
    bgColor: '#f1f5f9', 
    shape: 'circle',
    defaultWidth: 1.5,
    defaultHeight: 1.5,
  },
  path: { 
    label: 'Path', 
    color: '#78350f', 
    bgColor: '#fde68a', 
    shape: 'rectangle',
    defaultWidth: 8,
    defaultHeight: 1,
  },
  wall: { 
    label: 'Wall', 
    color: '#71717a', 
    bgColor: '#f4f4f5', 
    shape: 'rectangle',
    defaultWidth: 6,
    defaultHeight: 0.3,
  },
  house: { 
    label: 'House', 
    color: '#dc2626', 
    bgColor: '#fee2e2', 
    shape: 'rectangle',
    defaultWidth: 8,
    defaultHeight: 6,
  },
};

export const DIMENSION_UNITS: ('m' | 'ft')[] = ['m', 'ft'];
export const TEMPERATURE_UNITS: ('C' | 'F')[] = ['C', 'F'];

export const GARDEN_TEMPLATES: GardenTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Garden',
    description: 'Start from scratch with custom dimensions',
    icon: '📐',
    terrain: {
      dimensions: { width: 10, depth: 10, unit: 'm' },
      orientation: 'N',
      soil: 'loamy',
      ph: { min: 6.0, max: 7.0 },
      climate: 'temperate',
      precipitation: 'medium',
      annualPrecipitationMm: 800,
      temperature: { min: 10, max: 25, unit: 'C' },
    },
  },
  {
    id: 'los-cardales',
    name: 'Los Cardales',
    description: 'Subtropical garden in Buenos Aires, Argentina (36x70m)',
    icon: '🌿',
    terrain: {
      dimensions: { width: 70, depth: 36, unit: 'm' },
      orientation: 'N',
      soil: 'loamy',
      ph: { min: 5.5, max: 7.0 },
      climate: 'subtropical',
      precipitation: 'high',
      annualPrecipitationMm: 1100,
      temperature: { min: 8, max: 32, unit: 'C' },
      coordinates: { latitude: -34.333, longitude: -59.0 },
      region: 'Buenos Aires Province',
      country: 'Argentina',
    },
  },
];
