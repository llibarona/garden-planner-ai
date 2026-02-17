'use client';

import { useState } from 'react';
import { PlantLibrary } from '@/components/sidebar/PlantLibrary';
import { ObstacleLibrary } from '@/components/sidebar/ObstacleLibrary';
import { TerrainSettings } from '@/components/sidebar/TerrainSettings';
import { cn } from '@/lib/utils';

type Tab = 'plants' | 'setup';

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('plants');

  return (
    <aside className="w-72 bg-[var(--surface)] border-r border-gray-200 flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('plants')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'plants'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          Plants
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'setup'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          Setup
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'plants' && (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-[var(--text-primary)]">Plants</h2>
              <a href="/admin/plants" className="text-xs text-[var(--primary)] hover:underline">
                Manage
              </a>
            </div>
            <div className="flex-1 overflow-hidden">
              <PlantLibrary />
            </div>
          </>
        )}

        {activeTab === 'setup' && (
          <>
            <div className="flex-1 overflow-y-auto">
              <TerrainSettings />
              <div className="border-t border-gray-200 mt-4">
                <ObstacleLibrary className="p-4" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <h2 className="font-semibold text-[var(--text-primary)] mb-2">Layers</h2>
      </div>
    </aside>
  );
}
