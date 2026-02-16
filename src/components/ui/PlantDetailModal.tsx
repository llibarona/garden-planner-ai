'use client';

import type { Plant } from '@/types';
import { cn } from '@/lib/utils';
import { 
  PLANT_CATEGORY_VISUALS,
  SUNLIGHT_VISUALS,
  WATER_NEEDS_VISUALS,
  GROWTH_RATE_VISUALS,
  LIFECYCLE_VISUALS,
} from '@/data/constants';

interface PlantDetailModalProps {
  plant: Plant;
  onClose: () => void;
  className?: string;
}

function Badge({ label, color, bgColor, icon }: { label: string; color: string; bgColor: string; icon?: React.ReactNode }) {
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{ backgroundColor: bgColor, color }}
      title={label}
    >
      {icon}
      {label}
    </span>
  );
}

export function PlantDetailModal({ plant, onClose, className }: PlantDetailModalProps) {
  const categoryVisual = PLANT_CATEGORY_VISUALS[plant.category];
  const sunlightVisual = SUNLIGHT_VISUALS[plant.sunlight];
  const waterVisual = WATER_NEEDS_VISUALS[plant.water.needs];
  const growthVisual = GROWTH_RATE_VISUALS[plant.growthRate];
  const lifecycleVisual = plant.lifecycle ? LIFECYCLE_VISUALS[plant.lifecycle] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn(
        'relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden',
        className
      )}>
        <div 
          className="h-32 flex items-center justify-center"
          style={{ backgroundColor: plant.iconColor || '#2D5A27' }}
        >
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold">{plant.commonName}</h2>
            <p className="text-sm opacity-80 italic">{plant.scientificName}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 bg-white/20 hover:bg-white/30 rounded-full text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
          <div className="flex flex-wrap gap-2 mb-4">
            {lifecycleVisual && <Badge {...lifecycleVisual} />}
            <Badge {...categoryVisual} />
            <Badge {...sunlightVisual} />
            <Badge {...waterVisual} />
            {plant.isNative && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                Native
              </span>
            )}
            {plant.isInvasive && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">
                Invasive
              </span>
            )}
          </div>

          {plant.family && (
            <DetailSection title="Classification">
              <DetailRow label="Family" value={plant.family} />
              {plant.genus && <DetailRow label="Genus" value={plant.genus} />}
              {plant.species && <DetailRow label="Species" value={plant.species} />}
            </DetailSection>
          )}

          <DetailSection title="Size & Growth">
            <DetailRow label="Size" value={`${plant.size.width} x ${plant.size.height} ${plant.size.unit}`} />
            <DetailRow label="Growth Rate" value={plant.growthRate} visual={growthVisual} capitalize />
            <DetailRow label="Hardiness Zone" value={`${plant.hardinessZone.min} - ${plant.hardinessZone.max}`} />
          </DetailSection>

          <DetailSection title="Environment">
            <DetailRow label="Sunlight" value={plant.sunlight.replace('-', ' ')} visual={sunlightVisual} capitalize />
            <DetailRow label="Temperature" value={`${plant.temperature.min}° - ${plant.temperature.max}° ${plant.temperature.unit}`} />
            <DetailRow label="Water Needs" value={plant.water.needs} visual={waterVisual} capitalize />
            {plant.water.frequency && <DetailRow label="Water Frequency" value={plant.water.frequency} />}
          </DetailSection>

          <DetailSection title="Soil Requirements">
            <DetailRow label="Soil Type" value={plant.soil.type} capitalize />
            <DetailRow label="pH Range" value={`${plant.soil.ph.min} - ${plant.soil.ph.max}`} />
            <DetailRow label="Drainage" value={plant.soil.drainage} capitalize />
          </DetailSection>

          {plant.regions.length > 0 && (
            <DetailSection title="Regions">
              <div className="flex flex-wrap gap-1">
                {plant.regions.map((region) => (
                  <span key={region} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                    {region.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {(plant.bloomSeason?.length || plant.bloomColor?.length) && (
            <DetailSection title="Bloom">
              {plant.bloomSeason && plant.bloomSeason.length > 0 && (
                <DetailRow label="Season" value={plant.bloomSeason.join(', ')} capitalize />
              )}
              {plant.bloomColor && plant.bloomColor.length > 0 && (
                <DetailRow label="Color" value={plant.bloomColor.join(', ')} />
              )}
            </DetailSection>
          )}

          {plant.companionPlants.length > 0 && (
            <DetailSection title="Companion Plants">
              <div className="flex flex-wrap gap-1">
                {plant.companionPlants.map((id) => (
                  <span key={id} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    {id}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {plant.incompatiblePlants.length > 0 && (
            <DetailSection title="Incompatible Plants">
              <div className="flex flex-wrap gap-1">
                {plant.incompatiblePlants.map((id) => (
                  <span key={id} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                    {id}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {plant.additionalInfo.length > 0 && (
            <DetailSection title="Additional Info">
              {plant.additionalInfo.map((info, idx) => (
                <DetailRow key={idx} label={info.label} value={info.value} />
              ))}
            </DetailSection>
          )}

          {plant.notes && (
            <DetailSection title="Notes">
              <p className="text-sm text-gray-600">{plant.notes}</p>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
      {children}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  visual?: { label: string; color: string; bgColor: string };
  capitalize?: boolean;
}

function DetailRow({ label, value, visual, capitalize }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className={cn("text-sm text-gray-900", capitalize && "capitalize")}>{value}</span>
        {visual && (
          <Badge {...visual} />
        )}
      </div>
    </div>
  );
}
