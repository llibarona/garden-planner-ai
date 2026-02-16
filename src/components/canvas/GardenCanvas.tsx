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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
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
    const pxPerMeterX = availableWidth / terrainWidth;
    const pxPerMeterY = availableHeight / terrainHeight;
    return Math.min(pxPerMeterX, pxPerMeterY, 30);
  }, [dimensions.width, dimensions.height, terrainWidth, terrainHeight]);

  const scaledScale = baseScale * zoom;

  const terrainPixelWidth = terrainWidth * scaledScale;
  const terrainPixelHeight = terrainHeight * scaledScale;
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

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        setIsPanning(true);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
      }
    };
    const handleMouseUp = () => setIsPanning(false);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

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

    const x = (clientX - terrainX - pan.x) / scaledScale;
    const y = (clientY - terrainY - pan.y) / scaledScale;

    if (x < 0 || x > terrainWidth || y < 0 || y > terrainHeight) {
      return;
    }

    try {
      const parsed = JSON.parse(data);
      
      if (parsed.id && parsed.commonName) {
        const plant: Plant = parsed;
        const instanceId = `${plant.id}-${Date.now()}`;
        addPlant({ ...plant, instanceId, position: { x, y }, rotation: 0, scale: 1 });
        setSelectedElementId(instanceId);
      } else if (parsed.type) {
        const obstacle: PlacedObstacle = parsed;
        const instanceId = `${obstacle.type}-${Date.now()}`;
        addObstacle({ ...obstacle, instanceId, x, y });
        setSelectedElementId(instanceId);
      }
    } catch (err) {
      console.error('Failed to parse dropped item:', err, data);
    }
  }, [terrainX, terrainY, pan, scaledScale, terrainWidth, terrainHeight, addPlant, addObstacle, setSelectedElementId]);

  const toStageX = useCallback((meterX: number) => terrainX + meterX * scaledScale + pan.x, [terrainX, scaledScale, pan.x]);
  const toStageY = useCallback((meterY: number) => terrainY + meterY * scaledScale + pan.y, [terrainY, scaledScale, pan.y]);

  const fromStageX = useCallback((stageX: number) => (stageX - terrainX - pan.x) / scaledScale, [terrainX, pan.x, scaledScale]);
  const fromStageY = useCallback((stageY: number) => (stageY - terrainY - pan.y) / scaledScale, [terrainY, pan.y, scaledScale]);

  const handlePlantDragEnd = useCallback((instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    updatePlant(instanceId, { position: { x: fromStageX(node.x()), y: fromStageY(node.y()) } });
  }, [fromStageX, fromStageY, updatePlant]);

  const handleObstacleDragEnd = useCallback((instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    updateObstacle(instanceId, { x: fromStageX(node.x()), y: fromStageY(node.y()) });
  }, [fromStageX, fromStageY, updateObstacle]);

  const renderTerrain = () => (
    <Rect x={terrainX + pan.x} y={terrainY + pan.y} width={terrainPixelWidth} height={terrainPixelHeight}
      fill="#e8f5e9" stroke="#2e7d32" strokeWidth={4} cornerRadius={4} />
  );

  const renderGrid = () => {
    const lines: ReactNode[] = [];
    const gridColor = '#c8e6c9';
    const majorColor = '#81c784';
    const startX = terrainX + pan.x;
    const startY = terrainY + pan.y;

    for (let i = 0; i <= terrainWidth; i += 1) {
      const x = startX + i * scaledScale;
      const isMajor = i % 5 === 0;
      lines.push(<Line key={`v-${i}`} points={[x, startY, x, startY + terrainPixelHeight]}
        stroke={isMajor ? majorColor : gridColor} strokeWidth={isMajor ? 1.5 : 0.5} />);
    }
    for (let i = 0; i <= terrainHeight; i += 1) {
      const y = startY + i * scaledScale;
      const isMajor = i % 5 === 0;
      lines.push(<Line key={`h-${i}`} points={[startX, y, startX + terrainPixelWidth, y]}
        stroke={isMajor ? majorColor : gridColor} strokeWidth={isMajor ? 1.5 : 0.5} />);
    }
    return lines;
  };

  const renderPlants = () => plants.map((plant) => {
    const isSelected = selectedElementId === plant.instanceId;
    const size = plant.size.width * plant.scale * scaledScale;
    const x = toStageX(plant.position.x);
    const y = toStageY(plant.position.y);

    return (
      <Group key={plant.instanceId} x={x} y={y} rotation={plant.rotation} draggable={tool === 'select'}
        onClick={() => setSelectedElementId(plant.instanceId)} onDragEnd={handlePlantDragEnd(plant.instanceId)}>
        <Circle radius={size / 2} fill={isSelected ? '#7CB342' : '#2D5A27'} opacity={0.8}
          stroke={isSelected ? '#FFB300' : 'transparent'} strokeWidth={isSelected ? 3 : 0} />
        <Text text={plant.commonName} fontSize={12} fill="#2C2C2C" align="center" offsetX={30} offsetY={-size / 2 - 8} width={60} />
      </Group>
    );
  });

  const renderObstacles = () => obstacles.map((obstacle) => {
    const isSelected = selectedElementId === obstacle.instanceId;
    const visual = OBSTACLE_VISUALS[obstacle.type];
    const x = toStageX(obstacle.x);
    const y = toStageY(obstacle.y);
    const w = obstacle.width * scaledScale;
    const h = obstacle.height * scaledScale;

    const props = { fill: isSelected ? visual.bgColor : visual.color,
      stroke: isSelected ? '#FFB300' : visual.bgColor, strokeWidth: isSelected ? 3 : 1, opacity: 0.9 as const };

    const shape = visual.shape === 'circle' ? <Circle x={x + w/2} y={y + h/2} radius={Math.min(w, h)/2} {...props} />
      : visual.shape === 'ellipse' ? <Ellipse x={x + w/2} y={y + h/2} radiusX={w/2} radiusY={h/2} {...props} />
      : <Rect x={x} y={y} width={w} height={h} {...props} />;

    return (
      <Group key={obstacle.instanceId} x={x} y={y} rotation={obstacle.rotation} draggable={tool === 'select'}
        onClick={() => setSelectedElementId(obstacle.instanceId)} onDragEnd={handleObstacleDragEnd(obstacle.instanceId)}>
        {shape}
      </Group>
    );
  });

  return (
    <div ref={containerRef} className={cn('relative bg-gray-100 overflow-hidden', className)}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }} onDragOver={handleDragOver} onDrop={handleDrop}>
      <Stage ref={stageRef} width={dimensions.width} height={dimensions.height} onWheel={handleWheel}>
        <Layer>{renderGrid()}{renderTerrain()}{renderObstacles()}{renderPlants()}</Layer>
      </Stage>
      <PlantSelectionToolbar onShowDetail={setDetailPlant} />
      <PlantTransformControls />
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow-md text-sm text-gray-600">{terrainWidth}m × {terrainHeight}m</div>
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
