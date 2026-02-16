'use client';

import { useState, useMemo } from 'react';
import { plants } from '@/data/plants';
import type { Plant, PlantFilters, PlantCategory, Sunlight, WaterNeeds, GrowthRate } from '@/types';
import { cn } from '@/lib/utils';

interface PlantLibraryProps {
  className?: string;
  onDragStart?: (plant: Plant) => void;
}

export function PlantLibrary({ className, onDragStart }: PlantLibraryProps) {
  const [filters, setFilters] = useState<PlantFilters>({});
  const [search, setSearch] = useState('');

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          plant.commonName.toLowerCase().includes(searchLower) ||
          plant.scientificName.toLowerCase().includes(searchLower) ||
          plant.family?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.category?.length && !filters.category.includes(plant.category)) {
        return false;
      }

      if (filters.sunlight?.length && !filters.sunlight.includes(plant.sunlight)) {
        return false;
      }

      if (filters.waterNeeds?.length && !filters.waterNeeds.includes(plant.water.needs)) {
        return false;
      }

      if (filters.soilType?.length && !filters.soilType.includes(plant.soil.type)) {
        return false;
      }

      if (filters.growthRate?.length && !filters.growthRate.includes(plant.growthRate)) {
        return false;
      }

      if (filters.regions?.length && !plant.regions.some((r) => filters.regions?.includes(r))) {
        return false;
      }

      if (filters.hardinessZone) {
        if (plant.hardinessZone.min > filters.hardinessZone || plant.hardinessZone.max < filters.hardinessZone) {
          return false;
        }
      }

      return true;
    });
  }, [search, filters]);

  const handleDragStart = (e: React.DragEvent, plant: Plant) => {
    e.dataTransfer.setData('application/json', JSON.stringify(plant));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(plant);
  };

  const categories: PlantCategory[] = ['tree', 'shrub', 'flower', 'vegetable', 'herb', 'grass', 'succulent', 'vine', 'fern', 'palm'];
  const sunlightOptions: Sunlight[] = ['full-sun', 'partial-shade', 'shade'];
  const waterOptions: WaterNeeds[] = ['low', 'medium', 'high'];
  const growthOptions: GrowthRate[] = ['slow', 'medium', 'fast'];

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      </div>

      <div className="p-4 border-b border-gray-200 space-y-3">
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Category</label>
          <select
            multiple
            value={filters.category || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, (option) => option.value as PlantCategory);
              setFilters((prev) => ({ ...prev, category: values.length ? values : undefined }));
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm h-20"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Sun</label>
            <select
              value={filters.sunlight?.[0] || ''}
              onChange={(e) => {
                const value = e.target.value as Sunlight | '';
                setFilters((prev) => ({ ...prev, sunlight: value ? [value] : undefined }));
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="">All</option>
              {sunlightOptions.map((opt) => (
                <option key={opt} value={opt}>{opt.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Water</label>
            <select
              value={filters.waterNeeds?.[0] || ''}
              onChange={(e) => {
                const value = e.target.value as WaterNeeds | '';
                setFilters((prev) => ({ ...prev, waterNeeds: value ? [value] : undefined }));
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="">All</option>
              {waterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Growth</label>
            <select
              value={filters.growthRate?.[0] || ''}
              onChange={(e) => {
                const value = e.target.value as GrowthRate | '';
                setFilters((prev) => ({ ...prev, growthRate: value ? [value] : undefined }));
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
            >
              <option value="">All</option>
              {growthOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {(filters.category?.length || filters.sunlight?.length || filters.waterNeeds?.length || filters.growthRate?.length) && (
          <button
            onClick={() => setFilters({})}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-[var(--text-secondary)] mb-3">
          {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              draggable
              onDragStart={(e) => handleDragStart(e, plant)}
              className="p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-[var(--primary)] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: plant.iconColor || '#2D5A27' }}
                />
                <span className="font-medium text-sm text-[var(--text-primary)] truncate">
                  {plant.commonName}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] italic truncate">
                {plant.scientificName}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded">
                  {plant.category}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded">
                  {plant.sunlight.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <p>No plants match your filters</p>
            <button
              onClick={() => {
                setSearch('');
                setFilters({});
              }}
              className="text-xs text-[var(--primary)] hover:underline mt-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
