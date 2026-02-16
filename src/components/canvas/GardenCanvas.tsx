'use client';

import { useRef, useCallback, useEffect, useState, type ReactNode } from 'react';
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
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);

  const {
    tool,
    zoom,
    panOffset,
    selectedElementId,
    plants,
    terrain,
    obstacles,
    setZoom,
    setPanOffset,
    setSelectedElementId,
    updatePlant,
    addPlant,
    addObstacle,
    updateObstacle,
  } = useCanvasStore();

  const { terrain: gardenTerrain } = useGardenStore();

  const { config } = useConfigStore();

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
      const stage = stageRef.current;
      if (!stage) return;

      const oldScale = zoom;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.1;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const clampedScale = Math.max(0.25, Math.min(4, newScale));

      const mousePointTo = {
        x: (pointer.x - panOffset.x) / oldScale,
        y: (pointer.y - panOffset.y) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      };

      setZoom(clampedScale);
      setPanOffset(newPos);
    },
    [zoom, panOffset, setZoom, setPanOffset]
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

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!isPanning) return;

      const stage = stageRef.current;
      if (!stage) return;

      setPanOffset({
        x: panOffset.x + e.evt.movementX,
        y: panOffset.y + e.evt.movementY,
      });
    },
    [isPanning, panOffset, setPanOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

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

      const x = (e.clientX - rect.left - panOffset.x) / zoom;
      const y = (e.clientY - rect.top - panOffset.y) / zoom;

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
    [zoom, panOffset, addPlant, addObstacle, setSelectedElementId]
  );

  const handlePlantDragEnd = useCallback(
    (instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      const node = e.target;
      const scale = zoom;

      updatePlant(instanceId, {
        position: {
          x: (node.x() - panOffset.x) / scale,
          y: (node.y() - panOffset.y) / scale,
        },
      });
    },
    [zoom, panOffset, updatePlant]
  );

  const handleObstacleDragEnd = useCallback(
    (instanceId: string) => (e: Konva.KonvaEventObject<DragEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      const node = e.target;
      const scale = zoom;

      updateObstacle(instanceId, {
        x: (node.x() - panOffset.x) / scale,
        y: (node.y() - panOffset.y) / scale,
      });
    },
    [zoom, panOffset, updateObstacle]
  );

  const renderGrid = () => {
    if (!config.display.showGrid) return null;

    const gridSize = config.display.gridSize;
    const lines: ReactNode[] = [];
    const gridColor = '#e0e0e0';
    const majorGridColor = '#bdbdbd';

    const canvasWidth = config.canvas.defaultWidth;
    const canvasHeight = config.canvas.defaultHeight;

    for (let i = 0; i <= canvasWidth / gridSize; i++) {
      const x = i * gridSize;
      const isMajor = i % 4 === 0;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, 0, x, canvasHeight]}
          stroke={isMajor ? majorGridColor : gridColor}
          strokeWidth={isMajor ? 1 : 0.5}
        />
      );
    }

    for (let i = 0; i <= canvasHeight / gridSize; i++) {
      const y = i * gridSize;
      const isMajor = i % 4 === 0;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, y, canvasWidth, y]}
          stroke={isMajor ? majorGridColor : gridColor}
          strokeWidth={isMajor ? 1 : 0.5}
        />
      );
    }

    return lines;
  };

  const renderTerrain = () => {
    if (!terrain && !gardenTerrain) return null;

    const terrainShape = terrain;
    const gardenProps = gardenTerrain;

    let width = config.canvas.defaultWidth;
    let height = config.canvas.defaultHeight;

    if (gardenProps?.dimensions) {
      width = gardenProps.dimensions.width;
      height = gardenProps.dimensions.depth;
    } else if (terrainShape?.size) {
      width = terrainShape.size.width;
      height = terrainShape.size.height;
    }

    if (terrainShape?.type === 'circle') {
      return (
        <Circle
          x={terrainShape.position.x + terrainShape.size.width / 2}
          y={terrainShape.position.y + terrainShape.size.height / 2}
          radius={Math.min(terrainShape.size.width, terrainShape.size.height) / 2}
          fill="#f5f5dc"
          stroke="#8b7355"
          strokeWidth={2}
        />
      );
    }

    return (
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#f5f5dc"
        stroke="#8b7355"
        strokeWidth={2}
      />
    );
  };

  const renderPlants = () => {
    const plantsLayer = plants.map((plant) => {
      const isSelected = selectedElementId === plant.instanceId;
      const size = plant.size.width * plant.scale;

      return (
        <Group
          key={plant.instanceId}
          x={plant.position.x * zoom + panOffset.x}
          y={plant.position.y * zoom + panOffset.y}
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
      
      const x = obstacle.x * zoom + panOffset.x;
      const y = obstacle.y * zoom + panOffset.y;
      const width = obstacle.width * zoom;
      const height = obstacle.height * zoom;

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
        x={panOffset.x}
        y={panOffset.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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

      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="flex flex-col bg-white rounded-lg shadow-md">
          <button
            onClick={() => setZoom(zoom * 1.2)}
            className="px-3 py-2 hover:bg-gray-100 rounded-t-lg border-b border-gray-200"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom(zoom / 1.2)}
            className="px-3 py-2 hover:bg-gray-100 rounded-b-lg"
            title="Zoom Out"
          >
            −
          </button>
        </div>
        <button
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="px-3 py-1 bg-white rounded shadow-md text-sm hover:bg-gray-100"
          title="Reset View"
        >
          Reset
        </button>
      </div>

      <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded shadow-md text-sm text-gray-600">
        {Math.round(zoom * 100)}%
      </div>

      {detailPlant && (
        <PlantDetailModal plant={detailPlant} onClose={() => setDetailPlant(null)} />
      )}
    </div>
  );
}
