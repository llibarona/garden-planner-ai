'use client';

import { OBSTACLE_TYPES, OBSTACLE_VISUALS } from '@/data/terrainConstants';
import type { ObstacleType, PlacedObstacle } from '@/types';

interface ObstacleLibraryProps {
  className?: string;
}

function ObstacleIcon({ type }: { type: ObstacleType }) {
  const visual = OBSTACLE_VISUALS[type];
  
  if (visual.shape === 'circle' || visual.shape === 'ellipse') {
    return (
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: visual.bgColor }}
      >
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: visual.color }}
        />
      </div>
    );
  }
  
  return (
    <div 
      className="w-8 h-6 rounded flex items-center justify-center"
      style={{ backgroundColor: visual.bgColor }}
    >
      <div 
        className="w-6 h-3 rounded-sm"
        style={{ backgroundColor: visual.color }}
      />
    </div>
  );
}

export function ObstacleLibrary({ className }: ObstacleLibraryProps) {
  const handleDragStart = (e: React.DragEvent, type: ObstacleType) => {
    const visual = OBSTACLE_VISUALS[type];
    const obstacleData: Omit<PlacedObstacle, 'instanceId'> = {
      type,
      x: 0,
      y: 0,
      width: visual.defaultWidth,
      height: visual.defaultHeight,
      rotation: 0,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(obstacleData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={className}>
      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Obstacles</h3>
      <div className="grid grid-cols-2 gap-2">
        {OBSTACLE_TYPES.map((type) => {
          const visual = OBSTACLE_VISUALS[type];
          return (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              className="flex flex-col items-center p-2 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-[var(--primary)] hover:shadow-md transition-all"
            >
              <ObstacleIcon type={type} />
              <span className="text-xs text-[var(--text-secondary)] mt-1">
                {visual.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
