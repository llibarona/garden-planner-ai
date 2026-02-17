'use client';

import { useCanvasStore } from '@/stores/canvasStore';
import { cn } from '@/lib/utils';
import type { Plant } from '@/types';
import { OBSTACLE_VISUALS } from '@/data/terrainConstants';

interface PlantSelectionToolbarProps {
  className?: string;
  onShowDetail?: (plant: Plant) => void;
}

export function PlantSelectionToolbar({ className, onShowDetail }: PlantSelectionToolbarProps) {
  const { selectedElementId, plants, obstacles, removePlant, duplicatePlant, setSelectedElementId, removeObstacle, duplicateObstacle } = useCanvasStore();

  const selectedPlant = plants.find((p) => p.instanceId === selectedElementId);
  const selectedObstacle = obstacles.find((o) => o.instanceId === selectedElementId);

  if (!selectedElementId) return null;

  if (selectedObstacle) {
    const visual = OBSTACLE_VISUALS[selectedObstacle.type];
    
    const handleRemove = () => {
      removeObstacle(selectedElementId);
      setSelectedElementId(null);
    };

    const handleDuplicate = () => {
      duplicateObstacle(selectedElementId);
    };

    return (
      <div
        className={cn(
          'absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 px-2 py-1 flex items-center gap-1',
          className
        )}
      >
        <div className="px-2 py-1 text-sm font-medium text-[var(--text-primary)] border-r border-gray-200">
          {selectedObstacle.label || visual.label}
        </div>

        <button
          onClick={handleDuplicate}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-1"
          title="Duplicate obstacle (Ctrl+D)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
          Duplicate
        </button>

        <div className="h-4 w-px bg-gray-200" />

        <button
          onClick={handleRemove}
          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1"
          title="Remove obstacle (Delete)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Remove
        </button>
      </div>
    );
  }

  if (!selectedPlant) return null;

  const handleRemove = () => {
    removePlant(selectedElementId);
    setSelectedElementId(null);
  };

  const handleDuplicate = () => {
    duplicatePlant(selectedElementId);
  };

  return (
    <div
      className={cn(
        'absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 px-2 py-1 flex items-center gap-1',
        className
      )}
    >
      <div className="px-2 py-1 text-sm font-medium text-[var(--text-primary)] border-r border-gray-200">
        {selectedPlant.commonName}
      </div>

      <button
        onClick={() => onShowDetail?.(selectedPlant)}
        className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-1"
        title="View details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Details
      </button>

      <button
        onClick={handleDuplicate}
        className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-1"
        title="Duplicate plant (Ctrl+D)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
        Duplicate
      </button>

      <div className="h-4 w-px bg-gray-200" />

      <button
        onClick={handleRemove}
        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1"
        title="Remove plant (Delete)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        Remove
      </button>
    </div>
  );
}
