'use client';

import { useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { cn } from '@/lib/utils';

interface PlantTransformControlsProps {
  className?: string;
}

export function PlantTransformControls({ className }: PlantTransformControlsProps) {
  const { 
    selectedElementId, 
    plants, 
    obstacles,
    updatePlant, 
    updateObstacle,
    setSelectedElementId, 
    duplicatePlant,
    duplicateObstacle,
    removePlant,
    removeObstacle,
  } = useCanvasStore();
  
  const selectedPlant = plants.find((p) => p.instanceId === selectedElementId);
  const selectedObstacle = obstacles.find((o) => o.instanceId === selectedElementId);

  const handleScaleChange = useCallback((newScale: number) => {
    if (!selectedElementId) return;
    updatePlant(selectedElementId, { scale: newScale });
  }, [selectedElementId, updatePlant]);

  const handleRotationChange = useCallback((newRotation: number) => {
    if (!selectedElementId) return;
    if (selectedObstacle) {
      updateObstacle(selectedElementId, { rotation: newRotation });
    } else {
      updatePlant(selectedElementId, { rotation: newRotation });
    }
  }, [selectedElementId, selectedObstacle, updatePlant, updateObstacle]);

  const handleObstacleWidthChange = useCallback((newWidth: number) => {
    if (!selectedElementId) return;
    updateObstacle(selectedElementId, { width: newWidth });
  }, [selectedElementId, updateObstacle]);

  const handleObstacleHeightChange = useCallback((newHeight: number) => {
    if (!selectedElementId) return;
    updateObstacle(selectedElementId, { height: newHeight });
  }, [selectedElementId, updateObstacle]);

  const handleRemove = useCallback(() => {
    if (selectedObstacle) {
      removeObstacle(selectedElementId!);
    } else if (selectedPlant) {
      removePlant(selectedElementId!);
    }
    setSelectedElementId(null);
  }, [selectedElementId, selectedObstacle, selectedPlant, removeObstacle, removePlant, setSelectedElementId]);

  const handleDuplicate = useCallback(() => {
    if (selectedObstacle) {
      duplicateObstacle(selectedElementId!);
    } else if (selectedPlant) {
      duplicatePlant(selectedElementId!);
    }
  }, [selectedElementId, selectedObstacle, selectedPlant, duplicateObstacle, duplicatePlant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleRemove();
      }

      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handleDuplicate();
      }

      if (e.key === 'Escape') {
        setSelectedElementId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, handleRemove, handleDuplicate, setSelectedElementId]);

  if (!selectedElementId) return null;

  const isObstacle = !!selectedObstacle;
  const isPlant = !!selectedPlant;

  if (!isObstacle && !isPlant) return null;

  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-6',
        className
      )}
    >
      {isPlant && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 whitespace-nowrap">Scale</span>
            <input
              type="range"
              min="0.25"
              max="3"
              step="0.1"
              value={selectedPlant?.scale ?? 1}
              onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-600 w-12">{Math.round((selectedPlant?.scale ?? 1) * 100)}%</span>
          </div>

          <div className="h-6 w-px bg-gray-200" />
        </>
      )}

      {isObstacle && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 whitespace-nowrap">Width</span>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={selectedObstacle?.width ?? 1}
              onChange={(e) => handleObstacleWidthChange(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-600 w-10">{selectedObstacle?.width ?? 1}m</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 whitespace-nowrap">Height</span>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={selectedObstacle?.height ?? 1}
              onChange={(e) => handleObstacleHeightChange(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-600 w-10">{selectedObstacle?.height ?? 1}m</span>
          </div>

          <div className="h-6 w-px bg-gray-200" />
        </>
      )}

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 whitespace-nowrap">Rotation</span>
        <input
          type="range"
          min="0"
          max="360"
          step="15"
          value={(selectedObstacle ?? selectedPlant)?.rotation ?? 0}
          onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
          className="w-24"
        />
        <span className="text-xs text-gray-600 w-12">{Math.round((selectedObstacle ?? selectedPlant)?.rotation ?? 0)}°</span>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Del</kbd>
        <span>Remove</span>
        <span className="mx-1">•</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Ctrl+D</kbd>
        <span>Duplicate</span>
        <span className="mx-1">•</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd>
        <span>Deselect</span>
      </div>
    </div>
  );
}
