'use client';

import { useRef, useCallback, useEffect, useState, useMemo, type ReactNode } from 'react';
import { Stage, Layer, Rect, Circle, Group, Text, Line, Ellipse } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '@/stores/canvasStore';
import { useConfigStore } from '@/stores/configStore';
import { useGardenStore } from '@/stores/gardenStore';
import { cn } from '@/lib/utils';
import type { Plant, PlacedObstacle } from '@/types';
import { PlantSelectionToolbar } from './PlantSelectionToolbar';
import { PlantTransformControls } from './PlantTransformControls';
import { PlantDetailModal } from '@/components/ui/PlantDetailModal';
import { OBSTACLE_VISUALS } from '@/data/terrainConstants';

interface GardenCanvasProps {
  className?: string;
}

export function GardenCanvas({ className }: GardenCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);

  const {
    tool,
    selectedElementId,
    plants,
    obstacles,
    setSelectedElementId,
    updatePlant,
    addPlant,
    addObstacle,
    updateObstacle,
  } = useCanvasStore();

  const { terrain: gardenTerrain } = useGardenStore();
  const { config } = useConfigStore();

  const terrainWidth = gardenTerrain?.dimensions?.width ?? config.canvas.defaultWidth;
  const terrainHeight = gardenTerrain?.dimensions?.depth ?? config.canvas.defaultHeight;

  const baseScale = useMemo(() => {
    const padding = 80;
    const availableWidth = dimensions.width - padding * 2;
    const availableHeight = dimensions.height - padding * 2;
    const pixelsPerMeterX = availableWidth / terrainWidth;
    const pixelsPerMeterY = availableHeight / terrainHeight;
    return Math.min(pixelsPerMeterX, pixelsPerMeterY, 20);
  }, [dimensions.width, dimensions.height, terrainWidth, terrainHeight]);

  const effectiveScale = baseScale * zoom;
  const offsetX = (dimensions.width - terrainWidth * baseScale) / 2;
  const offsetY = (dimensions.height - terrainHeight * baseScale) / 2;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const scaleBy = 1.1;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newZoom = direction > 0 ? zoom * scaleBy : zoom / scaleBy;
      setZoom(Math.max(0.25, Math.min(4, newZoom)));
    },
    [zoom]
  );

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button === 1 || isSpacePressed || tool === 'pan') {
        setIsPanning(true);
        return;
      }

      if (tool === 'select') {
        const stage = stageRef.current;
        const target = e.target;
        if (target === stage) {
          setSelectedElementId(null);
        }
      }
    },
    [tool, isSpacePressed, setSelectedElementId]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      const x = (clientX - rect.left - offsetX) / effectiveScale;
      const y = (clientY - rect.top - offsetY) / effectiveScale;

      if (x < 0 || x > terrainWidth || y < 0 || y > terrainHeight) {
        return;
      }

      try {
        const parsed = JSON.parse(data);
        
        if (parsed.id && parsed.commonName) {
          const plant: Plant = parsed;
          const instanceId = `${plant.id}-${Date.now()}`;
          addPlant({
            ...plant,
            instanceId,
            position: { x, y },
            rotation: 0,
            scale: 1,
          });
          setSelectedElementId(instanceId);
        } else if (parsed.type && parsed.width !== undefined) {
          const obstacle: PlacedObstacle = parsed;
          const instanceId = `${obstacle.type}-${Date.now()}`;
          addObstacle({
            ...obstacle,
            instanceId,
            x,
            y,
          });
          setSelectedElementId(instanceId);
        }
      } catch (err) {
        console.error('Failed to parse dropped item:', err);
      }
    },
    [effectiveScale, offsetX, offsetY, terrainWidth, terrainHeight, addPlant, addObstacle, setSelectedElementId]
  );

  const handlePlantDragEnd = useCallback(
    (instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const x = (node.x() - offsetX) / effectiveScale;
      const y = (node.y() - offsetY) / effectiveScale;

      updatePlant(instanceId, {
        position: { x, y },
      });
    },
    [effectiveScale, offsetX, offsetY, updatePlant]
  );

  const handleObstacleDragEnd = useCallback(
    (instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const x = (node.x() - offsetX) / effectiveScale;
      const y = (node.y() - offsetY) / effectiveScale;

      updateObstacle(instanceId, {
        x,
        y,
      });
    },
    [effectiveScale, offsetX, offsetY, updateObstacle]
  );

  const renderTerrain = () => {
    if (!gardenTerrain) {
      return (
        <Rect
          x={offsetX}
          y={offsetY}
          width={terrainWidth * effectiveScale}
          height={terrainHeight * effectiveScale}
          fill="#f5f5dc"
          stroke="#8b7355"
          strokeWidth={3}
          cornerRadius={4}
        />
      );
    }

    return (
      <Rect
        x={offsetX}
        y={offsetY}
        width={terrainWidth * effectiveScale}
        height={terrainHeight * effectiveScale}
        fill="#e8f5e9"
        stroke="#2e7d32"
        strokeWidth={4}
        cornerRadius={4}
      />
    );
  };

  const renderGrid = () => {
    if (!config.display.showGrid) return null;

    const gridSize = 1; 
    const lines: ReactNode[] = [];
    const gridColor = '#c8e6c9';
    const majorGridColor = '#81c784';

    for (let i = 0; i <= terrainWidth; i += gridSize) {
      const x = offsetX + i * effectiveScale;
      const isMajor = i % 5 === 0;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, offsetY, x, offsetY + terrainHeight * effectiveScale]}
          stroke={isMajor ? majorGridColor : gridColor}
          strokeWidth={isMajor ? 1.5 : 0.5}
        />
      );
    }

    for (let i = 0; i <= terrainHeight; i += gridSize) {
      const y = offsetY + i * effectiveScale;
      const isMajor = i % 5 === 0;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[offsetX, y, offsetX + terrainWidth * effectiveScale, y]}
          stroke={isMajor ? majorGridColor : gridColor}
          strokeWidth={isMajor ? 1.5 : 0.5}
        />
      );
    }

    return lines;
  };

  const renderPlants = () => {
    const plantsLayer = plants.map((plant) => {
      const isSelected = selectedElementId === plant.instanceId;
      const size = plant.size.width * plant.scale * effectiveScale;

      return (
        <Group
          key={plant.instanceId}
          x={offsetX + plant.position.x * effectiveScale}
          y={offsetY + plant.position.y * effectiveScale}
          rotation={plant.rotation}
          draggable={tool === 'select'}
          onClick={() => setSelectedElementId(plant.instanceId)}
          onTap={() => setSelectedElementId(plant.instanceId)}
          onDragEnd={handlePlantDragEnd(plant.instanceId)}
        >
          <Circle
            radius={size / 2}
            fill={isSelected ? '#7CB342' : '#2D5A27'}
            opacity={0.8}
            stroke={isSelected ? '#FFB300' : 'transparent'}
            strokeWidth={isSelected ? 3 : 0}
          />
          <Text
            text={plant.commonName}
            fontSize={12}
            fill="#2C2C2C"
            align="center"
            offsetX={30}
            offsetY={-size / 2 - 8}
            width={60}
          />
        </Group>
      );
    });

    return plantsLayer;
  };

  const renderObstacles = () => {
    return obstacles.map((obstacle) => {
      const isSelected = selectedElementId === obstacle.instanceId;
      const visual = OBSTACLE_VISUALS[obstacle.type];
      
      const x = offsetX + obstacle.x * effectiveScale;
      const y = offsetY + obstacle.y * effectiveScale;
      const width = obstacle.width * effectiveScale;
      const height = obstacle.height * effectiveScale;

      const commonProps = {
        fill: isSelected ? visual.bgColor : visual.color,
        stroke: isSelected ? '#FFB300' : visual.bgColor,
        strokeWidth: isSelected ? 3 : 1,
        opacity: 0.9,
      };

      let shape;
      if (visual.shape === 'circle') {
        shape = (
          <Circle
            x={x + width / 2}
            y={y + height / 2}
            radius={Math.min(width, height) / 2}
            {...commonProps}
          />
        );
      } else if (visual.shape === 'ellipse') {
        shape = (
          <Ellipse
            x={x + width / 2}
            y={y + height / 2}
            radiusX={width / 2}
            radiusY={height / 2}
            {...commonProps}
          />
        );
      } else {
        shape = (
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            {...commonProps}
          />
        );
      }

      return (
        <Group
          key={obstacle.instanceId}
          x={x}
          y={y}
          rotation={obstacle.rotation}
          draggable={tool === 'select'}
          onClick={() => setSelectedElementId(obstacle.instanceId)}
          onTap={() => setSelectedElementId(obstacle.instanceId)}
          onDragEnd={handleObstacleDragEnd(obstacle.instanceId)}
        >
          {shape}
          {obstacle.label && (
            <Text
              text={obstacle.label}
              fontSize={10}
              fill="#2C2C2C"
              offsetX={20}
              offsetY={height + 5}
            />
          )}
        </Group>
      );
    });
  };

  const getCursor = () => {
    if (isPanning || isSpacePressed || tool === 'pan') return 'grab';
    if (tool === 'select') return 'default';
    return 'crosshair';
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-gray-100 overflow-hidden', className)}
      style={{ cursor: getCursor() }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={zoom}
        scaleY={zoom}
        x={dimensions.width / 2}
        y={dimensions.height / 2}
        offsetX={-dimensions.width / 2}
        offsetY={-dimensions.height / 2}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <Layer>
          {renderGrid()}
          {renderTerrain()}
          {renderObstacles()}
          {renderPlants()}
        </Layer>
      </Stage>

      <PlantSelectionToolbar onShowDetail={setDetailPlant} />
      <PlantTransformControls />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="bg-white px-3 py-1 rounded shadow-md text-sm text-gray-600">
          {terrainWidth}m x {terrainHeight}m
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <div className="flex flex-col bg-white rounded-lg shadow-md">
          <button
            onClick={() => setZoom(z => Math.min(4, z * 1.2))}
            className="px-3 py-2 hover:bg-gray-100 rounded-t-lg border-b border-gray-200"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.25, z / 1.2))}
            className="px-3 py-2 hover:bg-gray-100 rounded-b-lg"
            title="Zoom Out"
          >
            −
          </button>
        </div>
        <div className="bg-white px-3 py-1 rounded shadow-md text-sm text-gray-600">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {detailPlant && (
        <PlantDetailModal plant={detailPlant} onClose={() => setDetailPlant(null)} />
      )}
    </div>
  );
}
