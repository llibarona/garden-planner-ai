'use client';

import { useGardenStore } from '@/stores/gardenStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { GardenCanvas } from '@/components/canvas/GardenCanvas';

export default function Home() {
  const { gardenName, context } = useGardenStore();
  const { zoom } = useCanvasStore();

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
        <aside className="w-72 bg-[var(--surface)] border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-[var(--text-primary)]">Tools</h2>
          </div>
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-[var(--text-primary)]">Plants</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Plant library coming soon...</p>
          </div>
          <div className="p-4 flex-1">
            <h2 className="font-semibold text-[var(--text-primary)]">Layers</h2>
          </div>
        </aside>

        <main className="flex-1 relative overflow-hidden">
          <GardenCanvas />
        </main>

        <aside className="w-80 bg-[var(--surface)] border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-[var(--text-primary)]">Properties</h2>
          </div>
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
          <div className="p-4 flex-1">
            <p className="text-sm text-[var(--text-secondary)]">Select an element to view its properties</p>
          </div>
        </aside>
      </div>

      <footer className="h-12 flex items-center justify-between px-4 bg-[var(--surface)] border-t border-gray-200 text-sm text-[var(--text-secondary)]">
        <span>Ready</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </footer>
    </div>
  );
}
