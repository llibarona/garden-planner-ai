export type PlantCategory = 'tree' | 'shrub' | 'flower' | 'vegetable' | 'herb' | 'grass' | 'succulent';
export type Sunlight = 'full-sun' | 'partial-shade' | 'shade';
export type WaterNeeds = 'low' | 'medium' | 'high';
export type GrowthRate = 'slow' | 'medium' | 'fast';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ClimateType = 'tropical' | 'subtropical' | 'mediterranean' | 'temperate' | 'continental' | 'arid';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'chalky' | 'peaty' | 'silty';
export type Drainage = 'poor' | 'moderate' | 'good' | 'excellent';
export type SunExposure = 'sun' | 'shade';

export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  category: PlantCategory;
  sunlight: Sunlight;
  soilPh: { min: number; max: number };
  waterNeeds: WaterNeeds;
  size: { width: number; height: number; unit: 'cm' };
  hardinessZone: { min: number; max: number };
  growthRate: GrowthRate;
  companionPlants: string[];
  incompatiblePlants: string[];
  seasons: Season[];
  imageUrl?: string;
  notes?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PlacedPlant extends Plant {
  instanceId: string;
  position: Position;
  rotation: number;
  scale: number;
}

export interface GardenContext {
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  } | null;
  climate: {
    zone: number;
    type: ClimateType;
  };
  soil: {
    type: SoilType;
    ph: number;
    drainage: Drainage;
  };
  sunExposure: {
    north: SunExposure;
    south: SunExposure;
    east: SunExposure;
    west: SunExposure;
  };
}

export interface TerrainShape {
  id: string;
  type: 'rectangle' | 'circle' | 'polygon';
  position: Position;
  size: Size;
  points?: number[];
}

export interface Garden {
  id: string;
  name: string;
  terrain: TerrainShape;
  plants: PlacedPlant[];
  context: GardenContext;
  createdAt: string;
  updatedAt: string;
}

export type LayerType = 'base' | 'soil' | 'plants' | 'infrastructure' | 'annotations';

export interface Layer {
  id: LayerType;
  name: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export type Tool = 'select' | 'pan' | 'add-plant' | 'add-terrain' | 'draw-polygon' | 'measure';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  type: 'spacing' | 'sunlight' | 'soil' | 'incompatible' | 'zone';
  severity: ValidationSeverity;
  message: string;
  plantIds: string[];
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface AppConfig {
  ai: {
    provider: string;
    apiKey?: string;
    endpoint?: string;
    model?: string;
    temperature?: number;
  };
  display: {
    unit: 'metric' | 'imperial';
    gridSize: number;
    showGrid: boolean;
    showRulers: boolean;
    theme: 'light' | 'dark';
  };
  canvas: {
    defaultWidth: number;
    defaultHeight: number;
  };
}
