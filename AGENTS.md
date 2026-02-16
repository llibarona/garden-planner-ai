# AGENTS.md - Garden Planner AI

## Project Overview

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
No test framework configured yet. To add tests:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## Code Style Guidelines

### General Principles
- Keep components small and focused (single responsibility)
- Prefer composition over inheritance
- Write self-documenting code with clear variable/function names
- No comments unless explaining complex logic

### TypeScript
- **Always use explicit types** for function parameters and return types
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` when type is truly unknown

```typescript
// Good
function validatePlant(plant: Plant, context: GardenContext): ValidationResult {
  return { valid: true, issues: [] };
}

// Avoid
function validatePlant(plant, context) { }
```

### Imports (5-group order)
1. External libraries (React, Next.js)
2. Internal components
3. Stores/hooks
4. Types
5. Utils

Use absolute imports with `@/` alias:
```typescript
import { useState } from 'react';
import { GardenCanvas } from '@/components/canvas';
import { useGardenStore } from '@/stores/gardenStore';
import type { Plant } from '@/types';
import { cn } from '@/lib/utils';
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GardenCanvas.tsx` |
| Files | kebab-case | `garden-store.ts` |
| Functions | camelCase, verb prefix | `validatePlacement` |
| Constants | UPPER_SNAKE_CASE | `MAX_PLANT_COUNT` |
| Interfaces | PascalCase | `ValidationResult` |

### React/Next.js Patterns
- Use functional components with hooks
- Name component files same as component
- Use early returns for conditions

```typescript
export function PlantCard({ plant, onSelect }: PlantCardProps) {
  if (!plant) return null;
  
  return <div onClick={() => onSelect(plant.id)}>{plant.name}</div>;
}
```

### State Management (Zustand)
- Use Zustand stores with TypeScript
- Keep store slices focused and single-purpose

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

### Error Handling
- Use try/catch with specific error handling
- Display user-friendly error messages
- Validate inputs

```typescript
try {
  const result = await validatePlacement(plants, context);
  if (!result.valid) showWarnings(result.issues);
} catch (error) {
  console.error('Validation failed:', error);
  toast.error('Failed to validate. Please try again.');
}
```

### Tailwind CSS
- Use `cn()` utility for conditional classes
- Reference color palette from SPEC.md (primary: #2D5A27)

```typescript
<div className={cn("card shadow-sm", isSelected && "ring-2 ring-primary")}>
```

---

## Git Workflow

### Agent Rules
**ALWAYS use feature branches for new work:**
- Create a branch from `main` before starting any task
- Branch naming: `feature/` for features, `bugfix/` for fixes, `refactor/` for refactoring
- Commit changes and push the branch
- Create a PR to `main` when complete
- **NEVER commit directly to main**

### Branching
- `main` - Production-ready (never commit directly)
- `feature/` - New features (e.g., `feature/plant-library`)
- `bugfix/` - Bug fixes (e.g., `bugfix/canvas-zoom`)
- `refactor/` - Refactoring (e.g., `refactor/stores`)

### Process
1. Pull latest main: `git checkout main && git pull`
2. Create branch: `git checkout -b feature/your-feature`
3. Make changes and commit
4. Push: `git push -u origin feature/your-feature`
5. Create PR to main

### Validation Required
Before creating PR:
- Run `npm run lint`
- Run `npx tsc --noEmit`
- Ensure build succeeds: `npm run build`

---

## File Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── canvas/       # Canvas components
│   ├── sidebar/      # Sidebar components
│   ├── properties/   # Properties panel
│   └── ui/           # Reusable UI
├── stores/           # Zustand stores
├── lib/              # Utilities, AI, plants
├── types/            # TypeScript types
└── data/             # Static data
```

---

## Documentation

- **SPEC.md** - Technical specification
- Update docs when interfaces change

---

## Next Steps (Planned Features)

### Canvas Tools
- [ ] Plant manipulation (select, move, resize, rotate)
- [ ] Delete plants from canvas (keyboard shortcut + button)
- [ ] Multi-select plants
- [ ] Undo/redo functionality
- [ ] Copy/paste plants

### Terrain
- [ ] Add terrain creation tools (rectangle, circle)
- [ ] Edit terrain shape and size
- [ ] Multiple terrain shapes per garden

### Plant Library
- [ ] CRUD operations for plants (create, read, update, delete)
- [ ] Import/export plant database
- [ ] More filter options (soil type, hardiness zone, region)
- [ ] Plant images support

### Properties Panel
- [ ] Show selected plant properties
- [ ] Edit plant position, rotation, scale
- [ ] Edit plant-specific settings

### Validation
- [ ] AI-powered plant placement validation
- [ ] Companion plant suggestions
- [ ] Incompatible plant warnings
- [ ] Climate/soil compatibility checks

### Persistence
- [ ] Save garden to localStorage
- [ ] Export garden as JSON
- [ ] Export canvas as PNG/PDF

### Layers
- [ ] Layer visibility toggles
- [ ] Layer reordering
- [ ] Layer locking

### UI/UX
- [ ] Tool picker sidebar
- [ ] Keyboard shortcuts
- [ ] Context menu (right-click)
- [ ] Responsive design for tablet
