import type { 
  PlantCategory, 
  Sunlight, 
  WaterNeeds, 
  GrowthRate,
  PlantRegion,
  SoilType,
  Drainage,
  Season 
} from '@/types';

export const PLANT_CATEGORIES: PlantCategory[] = [
  'tree',
  'shrub',
  'flower',
  'vegetable',
  'herb',
  'grass',
  'succulent',
  'vine',
  'fern',
  'palm',
];

export const SUNLIGHT_OPTIONS: Sunlight[] = [
  'full-sun',
  'partial-shade',
  'shade',
];

export const WATER_NEEDS_OPTIONS: WaterNeeds[] = [
  'low',
  'medium',
  'high',
];

export const GROWTH_RATE_OPTIONS: GrowthRate[] = [
  'slow',
  'medium',
  'fast',
];

export const PLANT_REGIONS: PlantRegion[] = [
  'europe',
  'north-america',
  'south-america',
  'africa',
  'asia',
  'oceania',
  'mediterranean',
  'tropical',
  'worldwide',
];

export const SOIL_TYPES: SoilType[] = [
  'clay',
  'sandy',
  'loamy',
  'chalky',
  'peaty',
  'silty',
];

export const DRAINAGE_OPTIONS: Drainage[] = [
  'poor',
  'moderate',
  'good',
  'excellent',
];

export const SEASONS: Season[] = [
  'spring',
  'summer',
  'autumn',
  'winter',
];
