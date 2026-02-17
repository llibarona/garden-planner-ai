'use client';

import { useGardenStore } from '@/stores/gardenStore';
import { GARDEN_TEMPLATES, TERRAIN_ORIENTATIONS, ORIENTATION_VISUALS, PRECIPITATION_LEVELS, PRECIPITATION_VISUALS, DIMENSION_UNITS } from '@/data/terrainConstants';
import { SOIL_TYPES } from '@/data/constants';
import type { Terrain } from '@/types';

export function TerrainSettings() {
  const { terrain, setTerrain } = useGardenStore();

  const handleTemplateChange = (templateId: string) => {
    const template = GARDEN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const newTerrain: Terrain = {
        id: `terrain-${Date.now()}`,
        name: template.name,
        ...template.terrain,
      };
      setTerrain(newTerrain);
    }
  };

  const updateTerrain = (updates: Partial<Terrain>) => {
    if (terrain) {
      setTerrain({ ...terrain, ...updates });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-semibold text-[var(--text-primary)]">Terrain Settings</h2>

      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
          Template
        </label>
        <select
          value={terrain?.id?.startsWith('terrain-') ? '' : terrain?.name || ''}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        >
          <option value="">Select a template...</option>
          {GARDEN_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.icon} {template.name}
            </option>
          ))}
        </select>
      </div>

      {terrain && (
        <>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Dimensions
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={terrain.dimensions.width}
                onChange={(e) => updateTerrain({
                  dimensions: { ...terrain.dimensions, width: parseFloat(e.target.value) || 0 }
                })}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Width"
              />
              <span className="self-center text-gray-400">x</span>
              <input
                type="number"
                value={terrain.dimensions.depth}
                onChange={(e) => updateTerrain({
                  dimensions: { ...terrain.dimensions, depth: parseFloat(e.target.value) || 0 }
                })}
                className="w-20 px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Depth"
              />
              <select
                value={terrain.dimensions.unit}
                onChange={(e) => updateTerrain({
                  dimensions: { ...terrain.dimensions, unit: e.target.value as 'm' | 'ft' }
                })}
                className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm"
              >
                {DIMENSION_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Orientation
            </label>
            <select
              value={terrain.orientation}
              onChange={(e) => updateTerrain({ orientation: e.target.value as Terrain['orientation'] })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              {TERRAIN_ORIENTATIONS.map((orient) => (
                <option key={orient} value={orient}>
                  {ORIENTATION_VISUALS[orient].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Soil Type
            </label>
            <select
              value={terrain.soil}
              onChange={(e) => updateTerrain({ soil: e.target.value as Terrain['soil'] })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              {SOIL_TYPES.map((soil) => (
                <option key={soil} value={soil}>
                  {soil.charAt(0).toUpperCase() + soil.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Climate
            </label>
            <select
              value={terrain.climate}
              onChange={(e) => updateTerrain({ climate: e.target.value as Terrain['climate'] })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="tropical">Tropical</option>
              <option value="subtropical">Subtropical</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="temperate">Temperate</option>
              <option value="continental">Continental</option>
              <option value="arid">Arid</option>
              <option value="polar">Polar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              Precipitation
            </label>
            <select
              value={terrain.precipitation}
              onChange={(e) => updateTerrain({ precipitation: e.target.value as Terrain['precipitation'] })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              {PRECIPITATION_LEVELS.map((precip) => (
                <option key={precip} value={precip}>
                  {PRECIPITATION_VISUALS[precip].label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Min Temp
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={terrain.temperature.min}
                  onChange={(e) => updateTerrain({
                    temperature: { ...terrain.temperature, min: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
                <span className="text-xs text-gray-500">°{terrain.temperature.unit}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Max Temp
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={terrain.temperature.max}
                  onChange={(e) => updateTerrain({
                    temperature: { ...terrain.temperature, max: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
                <span className="text-xs text-gray-500">°{terrain.temperature.unit}</span>
              </div>
            </div>
          </div>

          {terrain.region && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Location:</span> {terrain.region}{terrain.country ? `, ${terrain.country}` : ''}
            </div>
          )}
        </>
      )}

      {!terrain && (
        <p className="text-sm text-gray-500 text-center py-4">
          Select a template to configure terrain
        </p>
      )}
    </div>
  );
}
