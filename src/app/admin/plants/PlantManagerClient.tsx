'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlantStore } from '@/stores/plantStore';
import { PlantForm } from '@/components/sidebar/PlantForm';
import type { Plant, PlantCategory } from '@/types';

type ViewMode = 'list' | 'create' | 'edit';

export function PlantManagerClient() {
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

  const categories: PlantCategory[] = ['tree', 'shrub', 'flower', 'vegetable', 'herb', 'grass', 'succulent', 'vine', 'fern', 'palm'];
  const totalPlants = plants.length;
  const categoryCount = categories.reduce((acc, cat) => {
    acc[cat] = plants.filter(p => p.category === cat).length;
    return acc;
  }, {} as Record<PlantCategory, number>);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="h-16 flex items-center justify-between px-6 bg-[var(--surface)] border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[var(--primary)] hover:underline">
            ← Back to Garden
          </Link>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Plant Database</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-secondary)]">{totalPlants} plants</span>
        </div>
      </header>

      <div className="p-6">
        {viewMode === 'list' && (
          <>
            <div className="mb-6 grid grid-cols-5 gap-4">
              {categories.map((cat) => (
                <div key={cat} className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold text-[var(--primary)]">{categoryCount[cat] || 0}</p>
                  <p className="text-sm text-[var(--text-secondary)] capitalize">{cat}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as PlantCategory | '')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setViewMode('create')}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-md text-sm hover:bg-[var(--primary-light)]"
                >
                  + Add Plant
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Plant</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Sunlight</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Water</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPlants.map((plant) => (
                      <tr key={plant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              style={{ backgroundColor: plant.iconColor || '#2D5A27' }}
                            />
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">{plant.commonName}</p>
                              <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs bg-gray-100 rounded capitalize">{plant.category}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plant.sunlight.replace('-', ' ')}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plant.water.needs}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{plant.size.width}x{plant.size.height} {plant.size.unit}</td>
                        <td className="px-4 py-3 text-right">
                          {confirmDelete === plant.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDelete(plant.id)}
                                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(plant)}
                                className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setConfirmDelete(plant.id)}
                                className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPlants.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No plants found
                </div>
              )}
            </div>
          </>
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {viewMode === 'edit' ? 'Edit Plant' : 'Create New Plant'}
              </h2>
              <button
                onClick={() => {
                  setViewMode('list');
                  setSelectedPlant(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to List
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
        )}
      </div>
    </div>
  );
}
