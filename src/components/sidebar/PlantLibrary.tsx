'use client';

import { useState, useMemo } from 'react';
import { plants } from '@/data/plants';
import type { Plant, PlantFilters } from '@/types';
import { cn } from '@/lib/utils';
import { 
  PLANT_CATEGORIES, 
  SUNLIGHT_OPTIONS, 
  WATER_NEEDS_OPTIONS, 
  GROWTH_RATE_OPTIONS,
  PLANT_CATEGORY_VISUALS,
  SUNLIGHT_VISUALS,
  WATER_NEEDS_VISUALS,
  PLANT_LIFECYCLES,
  LIFECYCLE_VISUALS,
} from '@/data/constants';
import { PlantDetailModal } from '@/components/ui/PlantDetailModal';

interface PlantLibraryProps {
  className?: string;
  onDragStart?: (plant: Plant) => void;
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  );
}

function WaterIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.133A6.75 6.75 0 0118 16.5h.75a.75.75 0 010 1.5h-2.25a.75.75 0 110-1.5h.75a.75.75 0 00.75-.75 6 6 0 01-5.25-5.25.75.75 0 00-1.5 0 4.5 4.5 0 01-4.5 4.5H4.5a.75.75 0 000 1.5h.75a6 6 0 0111.25-4.5 6 6 0 01-4.5 4.5.75.75 0 000 1.5 4.5 4.5 0 01-4.5-4.5H4.75a.75.75 0 000 1.5H6a.75.75 0 00.75-.75 6 6 0 01-2.25-5.25z" clipRule="evenodd" />
    </svg>
  );
}

export function PlantLibrary({ className, onDragStart }: PlantLibraryProps) {
  const [filters, setFilters] = useState<PlantFilters>({});
  const [search, setSearch] = useState('');
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);

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

      if (filters.lifecycle?.length && (!plant.lifecycle || !filters.lifecycle.includes(plant.lifecycle))) {
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

  const categories = PLANT_CATEGORIES;
  const sunlightOptions = SUNLIGHT_OPTIONS;
  const waterOptions = WATER_NEEDS_OPTIONS;
  const growthOptions = GROWTH_RATE_OPTIONS;
  const lifecycleOptions = PLANT_LIFECYCLES;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      </div>

      <div className="p-3 border-b border-gray-200 space-y-2">
        <select
          value={filters.category?.[0] || ''}
          onChange={(e) => {
            const value = e.target.value;
            setFilters((prev) => ({ ...prev, category: value ? [value as typeof PLANT_CATEGORIES[number]] : undefined }));
          }}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={filters.sunlight?.[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, sunlight: value ? [value as typeof SUNLIGHT_OPTIONS[number]] : undefined }));
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
          >
            <option value="">Sun</option>
            {sunlightOptions.map((opt) => (
              <option key={opt} value={opt}>{SUNLIGHT_VISUALS[opt].label}</option>
            ))}
          </select>

          <select
            value={filters.waterNeeds?.[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, waterNeeds: value ? [value as typeof WATER_NEEDS_OPTIONS[number]] : undefined }));
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
          >
            <option value="">Water</option>
            {waterOptions.map((opt) => (
              <option key={opt} value={opt}>{WATER_NEEDS_VISUALS[opt].label}</option>
            ))}
          </select>

          <select
            value={filters.growthRate?.[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, growthRate: value ? [value as typeof GROWTH_RATE_OPTIONS[number]] : undefined }));
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
          >
            <option value="">Growth</option>
            {growthOptions.map((opt) => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>

          <select
            value={filters.lifecycle?.[0] || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({ ...prev, lifecycle: value ? [value as typeof PLANT_LIFECYCLES[number]] : undefined }));
            }}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
          >
            <option value="">Life</option>
            {lifecycleOptions.map((opt) => (
              <option key={opt} value={opt}>{LIFECYCLE_VISUALS[opt].label}</option>
            ))}
          </select>
        </div>

        {(filters.category?.length || filters.sunlight?.length || filters.waterNeeds?.length || filters.growthRate?.length || filters.lifecycle?.length) && (
          <button
            onClick={() => setFilters({})}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-xs text-[var(--text-secondary)] mb-3">
          {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''}
        </div>

        <div className="space-y-3">
          {filteredPlants.map((plant) => {
            const categoryVisual = PLANT_CATEGORY_VISUALS[plant.category];
            const sunlightVisual = SUNLIGHT_VISUALS[plant.sunlight];
            const waterVisual = WATER_NEEDS_VISUALS[plant.water.needs];

            return (
              <div
                key={plant.id}
                draggable
                onDragStart={(e) => handleDragStart(e, plant)}
                className="bg-white border border-gray-200 rounded-lg p-3 cursor-grab hover:border-[var(--primary)] hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center text-center mb-2">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: plant.iconColor || '#2D5A27' }}
                  >
                    <span className="text-white text-lg font-bold">
                      {plant.commonName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--text-primary)] leading-tight">
                    {plant.commonName}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] italic leading-tight mt-0.5">
                    {plant.scientificName}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {plant.lifecycle && (
                    <span 
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: LIFECYCLE_VISUALS[plant.lifecycle].bgColor, 
                        color: LIFECYCLE_VISUALS[plant.lifecycle].color 
                      }}
                      title={LIFECYCLE_VISUALS[plant.lifecycle].label}
                    >
                      {LIFECYCLE_VISUALS[plant.lifecycle].icon}
                    </span>
                  )}

                  <span 
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: categoryVisual.bgColor, 
                      color: categoryVisual.color 
                    }}
                    title={categoryVisual.label}
                  >
                    {categoryVisual.icon}
                  </span>

                  <span 
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ 
                      backgroundColor: sunlightVisual.bgColor, 
                      color: sunlightVisual.color 
                    }}
                    title={sunlightVisual.label}
                  >
                    <SunIcon className="w-3 h-3" />
                  </span>

                  <span 
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ 
                      backgroundColor: waterVisual.bgColor, 
                      color: waterVisual.color 
                    }}
                    title={waterVisual.label}
                  >
                    <WaterIcon className="w-3 h-3" />
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailPlant(plant);
                  }}
                  className="w-full mt-2 text-xs text-[var(--primary)] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Details
                </button>
              </div>
            );
          })}
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

      {detailPlant && (
        <PlantDetailModal plant={detailPlant} onClose={() => setDetailPlant(null)} />
      )}
    </div>
  );
}
