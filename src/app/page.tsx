'use client';

import { useGardenStore } from '@/stores/gardenStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { GardenCanvas } from '@/components/canvas/GardenCanvas';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PlantDetailModal } from '@/components/ui/PlantDetailModal';
import { useState } from 'react';
import type { Plant } from '@/types';

export default function Home() {
  const { gardenName, context } = useGardenStore();
  const { zoom, selectedElementId, plants } = useCanvasStore();
  const [detailPlant, setDetailPlant] = useState<Plant | null>(null);

  const selectedPlant = selectedElementId 
    ? plants.find(p => p.instanceId === selectedElementId) 
    : null;

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      <header className="h-16 flex items-center justify-between px-4 bg-[var(--surface)] border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-[var(--primary)]">Garden Planner AI</h1>
          <span className="text-[var(--text-secondary)]">/</span>
          <span className="text-[var(--text-primary)]">{gardenName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-light)] transition-colors">
            Save
          </button>
          <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Export
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative overflow-hidden">
          <GardenCanvas />
        </main>

        <aside className="w-80 bg-[var(--surface)] border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-[var(--text-primary)]">Properties</h2>
          </div>
          
          {selectedPlant ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: selectedPlant.iconColor || '#2D5A27' }}
                />
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">{selectedPlant.commonName}</h3>
                  <p className="text-xs text-[var(--text-secondary)] italic">{selectedPlant.scientificName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase mb-2">Position</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">X:</span> {Math.round(selectedPlant.position.x)}
                    </div>
                    <div>
                      <span className="text-gray-500">Y:</span> {Math.round(selectedPlant.position.y)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase mb-2">Transform</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Scale:</span> {Math.round(selectedPlant.scale * 100)}%
                    </div>
                    <div>
                      <span className="text-gray-500">Rotation:</span> {Math.round(selectedPlant.rotation)}°
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase mb-2">Details</h4>
                  <button 
                    onClick={() => setDetailPlant(selectedPlant)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">Context Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)]">Climate Zone</label>
                  <p className="text-sm text-[var(--text-primary)]">{context.climate.zone} ({context.climate.type})</p>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-secondary)]">Soil Type</label>
                  <p className="text-sm text-[var(--text-primary)]">{context.soil.type} (pH {context.soil.ph})</p>
                </div>
              </div>
            </div>
          )}

          {!selectedPlant && (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-sm text-[var(--text-secondary)]">Select an element on the canvas to view its properties</p>
            </div>
          )}
        </aside>
      </div>

      <footer className="h-12 flex items-center justify-between px-4 bg-[var(--surface)] border-t border-gray-200 text-sm text-[var(--text-secondary)]">
        <span>{plants.length} plant{plants.length !== 1 ? 's' : ''} placed</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </footer>

      {detailPlant && (
        <PlantDetailModal plant={detailPlant} onClose={() => setDetailPlant(null)} />
      )}
    </div>
  );
}
