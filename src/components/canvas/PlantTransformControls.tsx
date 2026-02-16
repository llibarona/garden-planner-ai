'use client';

import { useState, useCallback, useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';
import { cn } from '@/lib/utils';

interface PlantTransformControlsProps {
  className?: string;
}

export function PlantTransformControls({ className }: PlantTransformControlsProps) {
  const { selectedElementId, plants, updatePlant, setSelectedElementId, duplicatePlant } = useCanvasStore();
  const selectedPlant = plants.find((p) => p.instanceId === selectedElementId);

  const [scale, setScale] = useState(selectedPlant?.scale ?? 1);
  const [rotation, setRotation] = useState(selectedPlant?.rotation ?? 0);

  const handleScaleChange = useCallback((newScale: number) => {
    if (!selectedElementId) return;
    setScale(newScale);
    updatePlant(selectedElementId, { scale: newScale });
  }, [selectedElementId, updatePlant]);

  const handleRotationChange = useCallback((newRotation: number) => {
    if (!selectedElementId) return;
    setRotation(newRotation);
    updatePlant(selectedElementId, { rotation: newRotation });
  }, [selectedElementId, updatePlant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        useCanvasStore.getState().removePlant(selectedElementId);
        setSelectedElementId(null);
      }

      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        duplicatePlant(selectedElementId);
      }

      if (e.key === 'Escape') {
        setSelectedElementId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, duplicatePlant, setSelectedElementId]);

  if (!selectedPlant || !selectedElementId) return null;

  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-6',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 whitespace-nowrap">Scale</span>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.1"
          value={scale}
          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
          className="w-24"
        />
        <span className="text-xs text-gray-600 w-12">{Math.round(scale * 100)}%</span>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 whitespace-nowrap">Rotation</span>
        <input
          type="range"
          min="0"
          max="360"
          step="15"
          value={rotation}
          onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
          className="w-24"
        />
        <span className="text-xs text-gray-600 w-12">{Math.round(rotation)}°</span>
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
