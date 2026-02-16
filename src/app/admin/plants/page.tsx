import type { Metadata } from 'next';
import { PlantManagerClient } from './PlantManagerClient';

export const metadata: Metadata = {
  title: 'Plant Database - Garden Planner AI',
  description: 'Manage your plant database',
};

export default function PlantManagerPage() {
  return <PlantManagerClient />;
}
