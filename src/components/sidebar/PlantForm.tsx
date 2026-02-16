'use client';

import { useState } from 'react';
import type { Plant, AdditionalInfo } from '@/types';
import { cn } from '@/lib/utils';
import {
  PLANT_CATEGORIES,
  SUNLIGHT_OPTIONS,
  WATER_NEEDS_OPTIONS,
  GROWTH_RATE_OPTIONS,
  PLANT_REGIONS,
  SOIL_TYPES,
  SEASONS,
} from '@/data/constants';

interface PlantFormProps {
  plant?: Plant | null;
  onSave: (plant: Plant) => void;
  onCancel: () => void;
  className?: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const defaultFormData: Partial<Plant> = {
  id: '',
  commonName: '',
  scientificName: '',
  family: '',
  genus: '',
  species: '',
  category: 'flower',
  regions: [],
  isNative: false,
  isInvasive: false,
  imageUrl: '',
  iconColor: '#2D5A27',
  size: { width: 50, height: 50, unit: 'cm' },
  growthRate: 'medium',
  hardinessZone: { min: 1, max: 10 },
  sunlight: 'full-sun',
  temperature: { min: 10, max: 30, unit: 'celsius' },
  soil: {
    type: 'loamy',
    ph: { min: 6.0, max: 7.0 },
    drainage: 'good',
  },
  water: {
    needs: 'medium',
    frequency: '',
  },
  bloomSeason: [],
  fruitSeason: [],
  bloomColor: [],
  companionPlants: [],
  incompatiblePlants: [],
  additionalInfo: [],
  notes: '',
};

export function PlantForm({ plant, onSave, onCancel, className }: PlantFormProps) {
  const [formData, setFormData] = useState<Partial<Plant>>(plant || defaultFormData);

  const [newInfoLabel, setNewInfoLabel] = useState('');
  const [newInfoValue, setNewInfoValue] = useState('');

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof Plant] as object), [field]: value },
    }));
  };

  const handleArrayField = (field: 'regions' | 'bloomSeason' | 'fruitSeason' | 'bloomColor' | 'companionPlants' | 'incompatiblePlants', value: string) => {
    const current = (formData[field] as string[]) || [];
    if (current.includes(value)) {
      handleChange(field, current.filter((v) => v !== value));
    } else {
      handleChange(field, [...current, value]);
    }
  };

  const handleAddInfo = () => {
    if (newInfoLabel && newInfoValue) {
      const info: AdditionalInfo = { label: newInfoLabel, value: newInfoValue };
      handleChange('additionalInfo', [...(formData.additionalInfo || []), info]);
      setNewInfoLabel('');
      setNewInfoValue('');
    }
  };

  const handleRemoveInfo = (index: number) => {
    handleChange('additionalInfo', (formData.additionalInfo || []).filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plantData: Plant = {
      id: formData.id || generateId(),
      commonName: formData.commonName || '',
      scientificName: formData.scientificName || '',
      family: formData.family,
      genus: formData.genus,
      species: formData.species,
      category: formData.category || 'flower',
      regions: formData.regions || [],
      isNative: formData.isNative,
      isInvasive: formData.isInvasive,
      imageUrl: formData.imageUrl,
      iconColor: formData.iconColor,
      size: formData.size || { width: 50, height: 50, unit: 'cm' },
      growthRate: formData.growthRate || 'medium',
      hardinessZone: formData.hardinessZone || { min: 1, max: 10 },
      sunlight: formData.sunlight || 'full-sun',
      temperature: formData.temperature || { min: 10, max: 30, unit: 'celsius' },
      soil: formData.soil || { type: 'loamy', ph: { min: 6.0, max: 7.0 }, drainage: 'good' },
      water: formData.water || { needs: 'medium', frequency: '' },
      bloomSeason: formData.bloomSeason,
      fruitSeason: formData.fruitSeason,
      bloomColor: formData.bloomColor,
      companionPlants: formData.companionPlants || [],
      incompatiblePlants: formData.incompatiblePlants || [],
      additionalInfo: formData.additionalInfo || [],
      notes: formData.notes,
    };
    onSave(plantData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6 max-h-[70vh] overflow-y-auto p-4', className)}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Common Name *</label>
          <input
            type="text"
            value={formData.commonName}
            onChange={(e) => handleChange('commonName', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Scientific Name</label>
          <input
            type="text"
            value={formData.scientificName}
            onChange={(e) => handleChange('scientificName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm italic"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Family</label>
          <input
            type="text"
            value={formData.family}
            onChange={(e) => handleChange('family', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Genus</label>
          <input
            type="text"
            value={formData.genus}
            onChange={(e) => handleChange('genus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Species</label>
          <input
            type="text"
            value={formData.species}
            onChange={(e) => handleChange('species', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm italic"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {PLANT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Growth Rate</label>
          <select
            value={formData.growthRate}
            onChange={(e) => handleChange('growthRate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {GROWTH_RATE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Sunlight</label>
          <select
            value={formData.sunlight}
            onChange={(e) => handleChange('sunlight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {SUNLIGHT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt.replace('-', ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Water Needs</label>
          <select
            value={formData.water?.needs}
            onChange={(e) => handleNestedChange('water', 'needs', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {WATER_NEEDS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Width (cm)</label>
          <input
            type="number"
            value={formData.size?.width}
            onChange={(e) => handleNestedChange('size', 'width', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Height (cm)</label>
          <input
            type="number"
            value={formData.size?.height}
            onChange={(e) => handleNestedChange('size', 'height', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Icon Color</label>
          <input
            type="color"
            value={formData.iconColor}
            onChange={(e) => handleChange('iconColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Hardiness Zone Min</label>
          <input
            type="number"
            value={formData.hardinessZone?.min}
            onChange={(e) => handleNestedChange('hardinessZone', 'min', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Hardiness Zone Max</label>
          <input
            type="number"
            value={formData.hardinessZone?.max}
            onChange={(e) => handleNestedChange('hardinessZone', 'max', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Soil Type</label>
          <select
            value={formData.soil?.type}
            onChange={(e) => handleNestedChange('soil', 'type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {SOIL_TYPES.map((opt) => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Soil pH Min</label>
          <input
            type="number"
            step="0.1"
            value={formData.soil?.ph?.min}
            onChange={(e) => handleNestedChange('soil', 'ph', { ...formData.soil?.ph, min: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Soil pH Max</label>
          <input
            type="number"
            step="0.1"
            value={formData.soil?.ph?.max}
            onChange={(e) => handleNestedChange('soil', 'ph', { ...formData.soil?.ph, max: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Regions</label>
        <div className="flex flex-wrap gap-2">
          {PLANT_REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => handleArrayField('regions', region)}
              className={cn(
                'px-2 py-1 text-xs rounded border',
                formData.regions?.includes(region)
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-white text-gray-600 border-gray-300'
              )}
            >
              {region.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Bloom Season</label>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map((season) => (
            <button
              key={season}
              type="button"
              onClick={() => handleArrayField('bloomSeason', season)}
              className={cn(
                'px-2 py-1 text-xs rounded border',
                formData.bloomSeason?.includes(season)
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'bg-white text-gray-600 border-gray-300'
              )}
            >
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Companion Plants (comma separated IDs)</label>
        <input
          type="text"
          value={formData.companionPlants?.join(', ')}
          onChange={(e) => handleChange('companionPlants', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="tomato, basil, carrot"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Incompatible Plants (comma separated IDs)</label>
        <input
          type="text"
          value={formData.incompatiblePlants?.join(', ')}
          onChange={(e) => handleChange('incompatiblePlants', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="cabbage, fennel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Additional Info</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newInfoLabel}
            onChange={(e) => setNewInfoLabel(e.target.value)}
            placeholder="Label"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="text"
            value={newInfoValue}
            onChange={(e) => setNewInfoValue(e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="button"
            onClick={handleAddInfo}
            className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        <div className="space-y-1">
          {formData.additionalInfo?.map((info, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded">
              <span className="text-sm"><strong>{info.label}:</strong> {info.value}</span>
              <button
                type="button"
                onClick={() => handleRemoveInfo(index)}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-md text-sm hover:bg-[var(--primary-light)]"
        >
          {plant ? 'Update' : 'Create'} Plant
        </button>
      </div>
    </form>
  );
}
