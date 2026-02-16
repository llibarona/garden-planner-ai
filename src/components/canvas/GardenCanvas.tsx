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

  const scale = useMemo(() => {
    const padding = 100;
    const availableWidth = dimensions.width - padding * 2;
    const availableHeight = dimensions.height - padding * 2;
    const pxPerMeterX = availableWidth / terrainWidth;
    const pxPerMeterY = availableHeight / terrainHeight;
    return Math.min(pxPerMeterX, pxPerMeterY, 30);
  }, [dimensions.width, dimensions.height, terrainWidth, terrainHeight]);

  const terrainPixelWidth = terrainWidth * scale;
  const terrainPixelHeight = terrainHeight * scale;
  const terrainX = (dimensions.width - terrainPixelWidth) / 2;
  const terrainY = (dimensions.height - terrainPixelHeight) / 2;

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

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newZoom = direction > 0 ? zoom * 1.1 : zoom / 1.1;
    setZoom(Math.max(0.25, Math.min(3, newZoom)));
  }, [zoom]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = (clientX - terrainX) / scale;
    const y = (clientY - terrainY) / scale;

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
  }, [scale, terrainX, terrainY, terrainWidth, terrainHeight, addPlant, addObstacle, setSelectedElementId]);

  const handlePlantDragEnd = useCallback(
    (instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const x = (node.x() - terrainX) / scale;
      const y = (node.y() - terrainY) / scale;
      updatePlant(instanceId, { position: { x, y } });
    },
    [scale, terrainX, terrainY, updatePlant]
  );

  const handleObstacleDragEnd = useCallback(
    (instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const x = (node.x() - terrainX) / scale;
      const y = (node.y() - terrainY) / scale;
      updateObstacle(instanceId, { x, y });
    },
    [scale, terrainX, terrainY, updateObstacle]
  );

  const renderTerrain = () => (
    <Rect
      x={terrainX}
      y={terrainY}
      width={terrainPixelWidth}
      height={terrainPixelHeight}
      fill="#e8f5e9"
      stroke="#2e7d32"
      strokeWidth={4}
      cornerRadius={4}
    />
  );

  const renderGrid = () => {
    const lines: ReactNode[] = [];
    const gridColor = '#c8e6c9';
    const majorColor = '#81c784';

    for (let i = 0; i <= terrainWidth; i += 1) {
      const x = terrainX + i * scale;
      const isMajor = i % 5 === 0;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, terrainY, x, terrainY + terrainPixelHeight]}
          stroke={isMajor ? majorColor : gridColor}
          strokeWidth={isMajor ? 1.5 : 0.5}
        />
      );
    }

    for (let i = 0; i <= terrainHeight; i += 1) {
      const y = terrainY + i * scale;
      const isMajor = i % 5 === 0;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[terrainX, y, terrainX + terrainPixelWidth, y]}
          stroke={isMajor ? majorColor : gridColor}
          strokeWidth={isMajor ? 1.5 : 0.5}
        />
      );
    }
    return lines;
  };

  const renderPlants = () => plants.map((plant) => {
    const isSelected = selectedElementId === plant.instanceId;
    const size = plant.size.width * plant.scale * scale;
    const x = terrainX + plant.position.x * scale;
    const y = terrainY + plant.position.y * scale;

    return (
      <Group
        key={plant.instanceId}
        x={x}
        y={y}
        rotation={plant.rotation}
        draggable={tool === 'select'}
        onClick={() => setSelectedElementId(plant.instanceId)}
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

  const renderObstacles = () => obstacles.map((obstacle) => {
    const isSelected = selectedElementId === obstacle.instanceId;
    const visual = OBSTACLE_VISUALS[obstacle.type];
    const x = terrainX + obstacle.x * scale;
    const y = terrainY + obstacle.y * scale;
    const w = obstacle.width * scale;
    const h = obstacle.height * scale;

    const commonProps = {
      fill: isSelected ? visual.bgColor : visual.color,
      stroke: isSelected ? '#FFB300' : visual.bgColor,
      strokeWidth: isSelected ? 3 : 1,
      opacity: 0.9 as const,
    };

    let shape;
    if (visual.shape === 'circle') {
      shape = <Circle x={x + w/2} y={y + h/2} radius={Math.min(w, h)/2} {...commonProps} />;
    } else if (visual.shape === 'ellipse') {
      shape = <Ellipse x={x + w/2} y={y + h/2} radiusX={w/2} radiusY={h/2} {...commonProps} />;
    } else {
      shape = <Rect x={x} y={y} width={w} height={h} {...commonProps} />;
    }

    return (
      <Group
        key={obstacle.instanceId}
        x={x}
        y={y}
        rotation={obstacle.rotation}
        draggable={tool === 'select'}
        onClick={() => setSelectedElementId(obstacle.instanceId)}
        onDragEnd={handleObstacleDragEnd(obstacle.instanceId)}
      >
        {shape}
      </Group>
    );
  });

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-gray-100 overflow-hidden', className)}
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

      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow-md text-sm text-gray-600">
        {terrainWidth}m × {terrainHeight}m
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <div className="flex flex-col bg-white rounded-lg shadow-md">
          <button onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="px-3 py-2 hover:bg-gray-100 rounded-t-lg border-b border-gray-200">+</button>
          <button onClick={() => setZoom(z => Math.max(0.25, z / 1.2))} className="px-3 py-2 hover:bg-gray-100 rounded-b-lg">−</button>
        </div>
        <div className="bg-white px-3 py-1 rounded shadow-md text-sm text-gray-600">{Math.round(zoom * 100)}%</div>
      </div>

      {detailPlant && <PlantDetailModal plant={detailPlant} onClose={() => setDetailPlant(null)} />}
    </div>
  );
}
