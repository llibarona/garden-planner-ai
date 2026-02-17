# AGENTS.md - Garden Planner AI

A visual drag-and-drop garden design tool with AI-powered validation. Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **React-Konva** for canvas.

---

## Commands

### Development
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run start        # Start production server
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint
npx tsc --noEmit     # Run TypeScript type check
```

### Testing
```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npx vitest run src/stores/canvasStore.test.ts  # Run single test file
npx vitest run -t "should add plant"           # Run single test by name
```

---

## Code Style

### TypeScript
- **Always use explicit types** for function parameters and return types
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` when type is truly unknown

### Imports (5-group order)
1. External libraries (React, Next.js)
2. Internal components
3. Stores/hooks
4. Types
5. Utils

Use absolute imports with `@/`:
```typescript
import { useState } from 'react';
import { GardenCanvas } from '@/components/canvas';
import { useGardenStore } from '@/stores/gardenStore';
import type { Plant } from '@/types';
import { cn } from '@/lib/utils';
```

### Naming
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GardenCanvas.tsx` |
| Files | kebab-case | `garden-store.ts` |
| Functions | camelCase, verb prefix | `validatePlacement` |
| Constants | UPPER_SNAKE_CASE | `MAX_PLANT_COUNT` |
| Interfaces | PascalCase | `ValidationResult` |

### React Patterns
- Use functional components with hooks
- Early returns for conditions
- Use `cn()` utility for conditional Tailwind classes

```typescript
export function PlantCard({ plant, onSelect }: PlantCardProps) {
  if (!plant) return null;
  return <div onClick={() => onSelect(plant.id)}>{plant.name}</div>;
}
```

### State (Zustand)
```typescript
interface GardenStore {
  plants: PlacedPlant[];
  addPlant: (plant: PlacedPlant) => void;
}

const useGardenStore = create<GardenStore>((set) => ({
  plants: [],
  addPlant: (plant) => set((state) => ({ plants: [...state.plants, plant] })),
}));
```

---

## Git Workflow

### Branching
- `master` - Production-ready (never commit directly)
- `feature/` - New features (e.g., `feature/plant-library`)
- `bugfix/` - Bug fixes (e.g., `bugfix/canvas-zoom`)
- `refactor/` - Refactoring

### Process
1. Pull latest master: `git checkout master && git pull`
2. Create branch: `git checkout -b feature/your-feature`
3. Make changes and commit
4. Push: `git push -u origin feature/your-feature`
5. Create PR to master

### Validation (Required Before PR)
```bash
npm run lint && npx tsc --noEmit && npm run test:run && npm run build
```

---

## File Structure
```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── canvas/       # GardenCanvas, tools
│   ├── sidebar/      # Sidebar panels
│   ├── properties/   # Properties panel
│   └── ui/           # Reusable UI
├── stores/           # Zustand stores
├── lib/              # Utilities
├── types/            # TypeScript types
└── data/             # Static data
```

---

## Key Patterns

### Unified Element System
Plants and obstacles share `PlacedElement` base type:
```typescript
interface PlacedElement {
  instanceId: string;
  position: { x: number; y: number };
  rotation: number;
}
```

### Canvas Coordinate System
- `toRender(meterX, meterY)` - Convert meters to stage pixels
- `fromRender(stageX, stageY)` - Convert stage pixels to meters
- Both use `scaledScale = baseScale * zoom` for rendering
