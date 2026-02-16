'use client';

import { useRef, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Stage, Layer, Rect, Circle, Group, Text, Line } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '@/stores/canvasStore';
import { useConfigStore } from '@/stores/configStore';
import { cn } from '@/lib/utils';
import type { Plant } from '@/types';
import { PlantSelectionToolbar } from './PlantSelectionToolbar';
import { PlantTransformControls } from './PlantTransformControls';

interface GardenCanvasProps {
  className?: string;
}

export function GardenCanvas({ className }: GardenCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const {
    tool,
    zoom,
    panOffset,
    selectedElementId,
    plants,
    terrain,
    setZoom,
    setPanOffset,
    setSelectedElementId,
    updatePlant,
    addPlant,
  } = useCanvasStore();

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

      try {
        const plant: Plant = JSON.parse(data);
        const stage = stageRef.current;
        if (!stage) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - panOffset.x) / zoom;
        const y = (e.clientY - rect.top - panOffset.y) / zoom;

        const instanceId = `${plant.id}-${Date.now()}`;
        addPlant({
          ...plant,
          instanceId,
          position: { x, y },
          rotation: 0,
          scale: 1,
        });
        setSelectedElementId(instanceId);
      } catch (err) {
        console.error('Failed to parse dropped plant:', err);
      }
    },
    [zoom, panOffset, addPlant, setSelectedElementId]
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
    if (!terrain) return null;

    const { type, position, size } = terrain;

    if (type === 'rectangle') {
      return (
        <Rect
          x={position.x}
          y={position.y}
          width={size.width}
          height={size.height}
          fill="#f5f5dc"
          stroke="#8b7355"
          strokeWidth={2}
        />
      );
    }

    if (type === 'circle') {
      return (
        <Circle
          x={position.x + size.width / 2}
          y={position.y + size.height / 2}
          radius={Math.min(size.width, size.height) / 2}
          fill="#f5f5dc"
          stroke="#8b7355"
          strokeWidth={2}
        />
      );
    }

    return null;
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
          {renderPlants()}
        </Layer>
      </Stage>

      <PlantSelectionToolbar />
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
    </div>
  );
}
