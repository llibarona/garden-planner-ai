export type PlantCategory = 
  | 'canopy' 
  | 'sub-canopy' 
  | 'shrub' 
  | 'herbaceous' 
  | 'groundcover' 
  | 'climber'
  | 'root'
  | 'fungi';

export type PlantLifecycle = 'annual' | 'biennial' | 'perennial' | 'ephemeral';

export type Sunlight = 'full-sun' | 'partial-shade' | 'shade';
export type WaterNeeds = 'low' | 'medium' | 'high';
export type GrowthRate = 'slow' | 'medium' | 'fast';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type SoilType = 'clay' | 'sandy' | 'loamy' | 'chalky' | 'peaty' | 'silty' | 'acidic';
export type Drainage = 'poor' | 'moderate' | 'good' | 'excellent';
export type SunExposure = 'sun' | 'shade';

export type ClimateType = 
  | 'tropical' 
  | 'subtropical' 
  | 'mediterranean' 
  | 'temperate' 
  | 'continental' 
  | 'arid'
  | 'polar';

export type PlantRegion = 
  | 'europe'
  | 'north-america'
  | 'south-america'
  | 'africa'
  | 'asia'
  | 'oceania'
  | 'mediterranean'
  | 'tropical'
  | 'worldwide';

export interface PlantSize {
  width: number;
  height: number;
  unit: 'cm' | 'm';
}

export interface PlantHardinessZone {
  min: number;
  max: number;
}

export interface SoilRequirements {
  type: SoilType;
  ph: {
    min: number;
    max: number;
  };
  drainage: Drainage;
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'celsius' | 'fahrenheit';
}

export interface PlantWater {
  needs: WaterNeeds;
  frequency: string;
}

export interface PlantCare {
  pruning?: string;
  fertilizing?: string;
  pests?: string[];
  diseases?: string[];
}

export interface AdditionalInfo {
  label: string;
  value: string;
}

export interface Plant {
  id: string;
  
  // Identification
  commonName: string;
  scientificName: string;
  family?: string;
  genus?: string;
  species?: string;
  
  // Category & Classification
  category: PlantCategory;
  lifecycle?: PlantLifecycle;
  regions: PlantRegion[];
  isNative?: boolean;
  isInvasive?: boolean;
  
  // Visual
  imageUrl?: string;
  iconColor?: string;
  
  // Size & Growth
  size: PlantSize;
  growthRate: GrowthRate;
  hardinessZone: PlantHardinessZone;
  
  // Environmental Requirements
  sunlight: Sunlight;
  temperature: TemperatureRange;
  soil: SoilRequirements;
  water: PlantWater;
  
  // Blooming/Fruiting
  bloomSeason?: Season[];
  fruitSeason?: Season[];
  bloomColor?: string[];
  
  // Relationships
  companionPlants: string[];
  incompatiblePlants: string[];
  
  // Care
  care?: PlantCare;
  
  // Additional
  additionalInfo: AdditionalInfo[];
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

// Garden Context (for validation)
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

// Terrain
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

// Layers
export type LayerType = 'base' | 'soil' | 'plants' | 'infrastructure' | 'annotations';

export interface Layer {
  id: LayerType;
  name: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

// Tools
export type Tool = 'select' | 'pan' | 'add-plant' | 'add-terrain' | 'draw-polygon' | 'measure';

// Validation
export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  type: 'spacing' | 'sunlight' | 'soil' | 'incompatible' | 'zone' | 'temperature' | 'water';
  severity: ValidationSeverity;
  message: string;
  plantIds: string[];
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// Config
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

// Filter types for plant library
export interface PlantFilters {
  search?: string;
  category?: PlantCategory[];
  sunlight?: Sunlight[];
  waterNeeds?: WaterNeeds[];
  soilType?: SoilType[];
  regions?: PlantRegion[];
  hardinessZone?: number;
  growthRate?: GrowthRate[];
  season?: Season[];
  lifecycle?: PlantLifecycle[];
}
