import type { SoilType, ClimateType } from './plants';

export type TerrainOrientation = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

export type PrecipitationLevel = 'low' | 'medium' | 'high';

export interface TerrainCoordinates {
  latitude: number;
  longitude: number;
}

export interface TerrainDimensions {
  width: number;
  depth: number;
  unit: 'm' | 'ft';
}

export interface TerrainTemperature {
  min: number;
  max: number;
  unit: 'C' | 'F';
}

export interface Terrain {
  id: string;
  name: string;
  dimensions: TerrainDimensions;
  orientation: TerrainOrientation;
  soil: SoilType;
  ph: {
    min: number;
    max: number;
  };
  climate: ClimateType;
  precipitation: PrecipitationLevel;
  annualPrecipitationMm?: number;
  temperature: TerrainTemperature;
  coordinates?: TerrainCoordinates;
  region?: string;
  country?: string;
}

export interface GardenTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  terrain: Omit<Terrain, 'id' | 'name'>;
}
