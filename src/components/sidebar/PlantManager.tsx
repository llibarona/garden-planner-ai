'use client';

import { useState } from 'react';
import { usePlantStore } from '@/stores/plantStore';
import { PlantForm } from './PlantForm';
import type { Plant, PlantCategory } from '@/types';

type ViewMode = 'list' | 'create' | 'edit';

export function PlantManager() {
  const { plants, addPlant, updatePlant, deletePlant } = usePlantStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PlantCategory | ''>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      !search ||
      plant.commonName.toLowerCase().includes(search.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || plant.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (plant: Plant) => {
    if (selectedPlant) {
      updatePlant(plant.id, plant);
    } else {
      addPlant(plant);
    }
    setViewMode('list');
    setSelectedPlant(null);
  };

  const handleEdit = (plant: Plant) => {
    setSelectedPlant(plant);
    setViewMode('edit');
  };

  const handleDelete = (id: string) => {
    deletePlant(id);
    setConfirmDelete(null);
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)]">
            {viewMode === 'edit' ? 'Edit Plant' : 'Create Plant'}
          </h2>
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedPlant(null);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </div>
        <PlantForm
          plant={selectedPlant}
          onSave={handleSave}
          onCancel={() => {
            setViewMode('list');
            setSelectedPlant(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[var(--text-primary)]">Plant Database</h2>
          <button
            onClick={() => setViewMode('create')}
            className="px-3 py-1.5 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-light)]"
          >
            + Add Plant
          </button>
        </div>
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as PlantCategory | '')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Categories</option>
          <option value="tree">Tree</option>
          <option value="shrub">Shrub</option>
          <option value="flower">Flower</option>
          <option value="vegetable">Vegetable</option>
          <option value="herb">Herb</option>
          <option value="grass">Grass</option>
          <option value="succulent">Succulent</option>
          <option value="vine">Vine</option>
          <option value="fern">Fern</option>
          <option value="palm">Palm</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 text-xs text-gray-500">
          {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''}
        </div>
        <div className="space-y-1 px-2">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:border-[var(--primary)] group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: plant.iconColor || '#2D5A27' }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {plant.commonName}
                  </p>
                  <p className="text-xs text-gray-500 italic truncate">
                    {plant.scientificName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(plant)}
                  className="p-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
                {confirmDelete === plant.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(plant.id)}
                      className="p-1 text-xs text-red-600 hover:bg-red-50 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="p-1 text-xs text-gray-500 hover:bg-gray-50 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(plant.id)}
                    className="p-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredPlants.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No plants found
          </div>
        )}
      </div>
    </div>
  );
}
