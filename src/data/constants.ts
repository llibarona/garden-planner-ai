import type { 
  PlantCategory, 
  PlantLifecycle,
  Sunlight, 
  WaterNeeds, 
  GrowthRate,
  PlantRegion,
  SoilType,
  Drainage,
  Season 
} from '@/types';

export interface OptionVisual {
  label: string;
  color: string;
  bgColor: string;
  icon?: string;
}

export const PLANT_CATEGORIES: PlantCategory[] = [
  'canopy',
  'sub-canopy',
  'shrub',
  'herbaceous',
  'groundcover',
  'climber',
  'root',
  'fungi',
];

export const PLANT_CATEGORY_VISUALS: Record<PlantCategory, OptionVisual> = {
  canopy: { label: 'Canopy (Tall Tree)', color: '#166534', bgColor: '#dcfce7', icon: 'C' },
  'sub-canopy': { label: 'Sub-Canopy (Small Tree)', color: '#15803d', bgColor: '#bbf7d0', icon: 'S' },
  shrub: { label: 'Shrub', color: '#be185d', bgColor: '#fce7f3', icon: 'Sh' },
  herbaceous: { label: 'Herbaceous', color: '#a16207', bgColor: '#fef9c3', icon: 'H' },
  groundcover: { label: 'Groundcover', color: '#65a30d', bgColor: '#ecfccb', icon: 'G' },
  climber: { label: 'Climber/Vine', color: '#7c3aed', bgColor: '#ede9fe', icon: 'Cl' },
  root: { label: 'Root/Tuber', color: '#0891b2', bgColor: '#cffafe', icon: 'R' },
  fungi: { label: 'Fungi', color: '#ca8a04', bgColor: '#fef08a', icon: 'F' },
};

export const SUNLIGHT_OPTIONS: Sunlight[] = [
  'full-sun',
  'partial-shade',
  'shade',
];

export const SUNLIGHT_VISUALS: Record<Sunlight, OptionVisual> = {
  'full-sun': { label: 'Full Sun', color: '#f59e0b', bgColor: '#fef3c7', icon: 'sun' },
  'partial-shade': { label: 'Partial Shade', color: '#f97316', bgColor: '#ffedd5', icon: 'cloud-sun' },
  shade: { label: 'Shade', color: '#6b7280', bgColor: '#f3f4f6', icon: 'cloud' },
};

export const WATER_NEEDS_OPTIONS: WaterNeeds[] = [
  'low',
  'medium',
  'high',
];

export const WATER_NEEDS_VISUALS: Record<WaterNeeds, OptionVisual> = {
  low: { label: 'Low Water', color: '#ef4444', bgColor: '#fee2e2' },
  medium: { label: 'Medium Water', color: '#eab308', bgColor: '#fef9c3' },
  high: { label: 'High Water', color: '#1d4ed8', bgColor: '#dbe4fe' },
};

export const GROWTH_RATE_OPTIONS: GrowthRate[] = [
  'slow',
  'medium',
  'fast',
];

export const GROWTH_RATE_VISUALS: Record<GrowthRate, OptionVisual> = {
  slow: { label: 'Slow', color: '#84cc16', bgColor: '#e6fffa' },
  medium: { label: 'Medium', color: '#22c55e', bgColor: '#dcfce7' },
  fast: { label: 'Fast', color: '#14b8a6', bgColor: '#ccfbf1' },
};

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
  'acidic',
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

export const SEASON_VISUALS: Record<Season, OptionVisual> = {
  spring: { label: 'Spring', color: '#22c55e', bgColor: '#dcfce7' },
  summer: { label: 'Summer', color: '#eab308', bgColor: '#fef9c3' },
  autumn: { label: 'Autumn', color: '#f97316', bgColor: '#ffedd5' },
  winter: { label: 'Winter', color: '#3b82f6', bgColor: '#dbeafe' },
};

export const PLANT_LIFECYCLES: PlantLifecycle[] = [
  'annual',
  'biennial',
  'perennial',
  'ephemeral',
];

export const LIFECYCLE_VISUALS: Record<PlantLifecycle, OptionVisual> = {
  annual: { label: 'Annual', color: '#16a34a', bgColor: '#dcfce7', icon: 'A' },
  biennial: { label: 'Biennial', color: '#7c3aed', bgColor: '#ede9fe', icon: 'B' },
  perennial: { label: 'Perennial', color: '#0891b2', bgColor: '#cffafe', icon: 'P' },
  ephemeral: { label: 'Ephemeral', color: '#ca8a04', bgColor: '#fef9c3', icon: 'E' },
};
