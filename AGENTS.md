# AGENTS.md - Garden Planner AI

## Project Overview

This is a **Garden Planner AI** web application - a visual drag-and-drop garden design tool with AI-powered validation and agronomic recommendations. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **React-Konva** for canvas.

---

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint
npm run typecheck   # Run TypeScript type check
```

### Testing
```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:ui     # Run tests with UI
```

**Run a single test file:**
```bash
npm run test -- GardenCanvas.test.tsx
# or with vitest
npx vitest run src/components/canvas/GardenCanvas.test.tsx
```

---

## MCP Tools

This project uses Model Context Protocol (MCP) tools for enhanced development capabilities.

### Configuration

MCP servers are configured in `.mcp.json`. Copy it to your MCP client config:
- **Claude Desktop**: `~/Library/Application Support/Claude/mcp_settings.json`
- **Cursor**: `~/.cursor/mcp.json`
- **opencode**: Uses `.mcp.json` in project root

### Installed MCP Servers

| Server | Purpose | Key Tools |
|--------|---------|-----------|
| **Chrome DevTools** | Browser debugging | navigate_page, take_screenshot, performance_trace |
| **Playwright** | UI testing, automation | click_element, fill_form, assert_text |
| **Filesystem** | Local file access | read_file, write_file, list_directory |

### Setup Requirements

1. **Chrome** - Install Chrome browser for DevTools MCP

2. **Node.js 18+** - Required for Playwright MCP

### Quick Setup

```bash
# Verify MCP servers work
npx @modelcontextprotocol/inspector
```

### Usage Examples

```bash
# Test Chrome DevTools MCP  
npx -y @anthropic-ai/mcp-server-chrome-devtools --help

# Test Playwright MCP
npx -y @playwright/mcp-server --help
```

---

## Code Style Guidelines

### General Principles
- Keep components small and focused (single responsibility)
- Prefer composition over inheritance
- Write self-documenting code with clear variable/function names
- No comments unless explaining complex logic (per project rules)

### TypeScript
- **Always use explicit types** for function parameters and return types
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` when type is truly unknown
- Enable strict mode in tsconfig.json

```typescript
// Good
function validatePlant(plant: Plant, context: GardenContext): ValidationResult {
  // ...
}

// Avoid
function validatePlant(plant, context) {
  // ...
}
```

### Imports
- Order imports consistently:
  1. External libraries (React, Next.js, etc.)
  2. Internal components
  3. Stores/hooks
  4. Types
  5. Utils
- Use absolute imports with `@/` alias for src/ directory
- Group imports with blank lines between groups

```typescript
// 1. External
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal components
import { GardenCanvas } from '@/components/canvas';
import { PlantCard } from '@/components/sidebar';

// 3. Stores/hooks
import { useGardenStore } from '@/stores/gardenStore';

// 4. Types
import type { Plant, GardenContext } from '@/types';

// 5. Utils
import { convertUnits } from '@/lib/utils/measurements';
```

### Naming Conventions
- **Components**: PascalCase (`GardenCanvas.tsx`, `PlantCard.tsx`)
- **Files**: kebab-case (`garden-store.ts`, `validation-utils.ts`)
- **Functions**: camelCase, verb prefix (`validatePlacement`, `recommendCompanions`)
- **Constants**: UPPER_SNAKE_CASE for enums/config
- **Interfaces**: PascalCase, descriptive (`ValidationResult`, `AIProvider`)

### React/Next.js Patterns
- Use functional components with hooks
- Name component files same as component: `GardenCanvas.tsx` → `export function GardenCanvas()`
- Colocate related files (component + tests + styles)
- Use early returns for conditions

```typescript
export function PlantCard({ plant, onSelect }: PlantCardProps) {
  if (!plant) return null;
  
  return (
    <div className="plant-card" onClick={() => onSelect(plant.id)}>
      {/* ... */}
    </div>
  );
}
```

### State Management (Zustand)
- Use Zustand stores with TypeScript
- Create separate stores: `gardenStore`, `canvasStore`, `configStore`
- Keep store slices focused and single-purpose

```typescript
interface GardenStore {
  plants: PlacedPlant[];
  addPlant: (plant: PlacedPlant) => void;
  removePlant: (id: string) => void;
  updatePlant: (id: string, updates: Partial<PlacedPlant>) => void;
}

const useGardenStore = create<GardenStore>((set) => ({
  plants: [],
  addPlant: (plant) => set((state) => ({ 
    plants: [...state.plants, plant] 
  })),
  // ...
}));
```

### Error Handling
- Use try/catch with specific error handling
- Display user-friendly error messages via Toast components
- Log errors appropriately (no sensitive data)
- Validate inputs with Zod for forms

```typescript
try {
  const result = await aiProvider.validatePlacement(plants, context);
  if (!result.valid) {
    showValidationWarnings(result.issues);
  }
} catch (error) {
  console.error('Validation failed:', error);
  toast.error('Failed to validate placement. Please try again.');
}
```

### Tailwind CSS
- Use utility classes consistently with design system
- Reference color palette from SPEC.md (primary: #2D5A27, etc.)
- Extract repeated class combinations into components
- Use `cn()` utility for conditional classes

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "card shadow-sm hover:shadow-md transition-shadow",
  isSelected && "ring-2 ring-primary"
)}>
```

---

## AI Agent Workflow

This project uses the **Supervisor-Worker pattern** defined in `documentation/AI Development Workflow.md`.

### Agent Types
| Agent | Role | When to Use |
|-------|------|-------------|
| **Supervisor** | Orchestrator (that's me) | Default - all requests come here |
| **Code** | Implementation | Building features, fixes |
| **Research** | Exploration | Finding files, understanding code |
| **Docs** | Documentation | Writing/updating docs |

### Workflow
1. **User request** → Supervisor analyzes
2. **Research** if needed (understand existing code)
3. **Plan** task breakdown
4. **Delegate** to appropriate agent
5. **Validate** (run lint/typecheck)
6. **Report** completion

---

## Git Workflow

### Branching Strategy
- **main** - Production-ready code (protected)
- **feature/** - New features (e.g., `feature/plant-drag-drop`)
- **bugfix/** - Bug fixes (e.g., `bugfix/canvas-zoom`)
- **refactor/** - Code refactoring

### Feature Development Process
1. Create a new branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit frequently:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push branch and create PR:
   ```bash
   git push -u origin feature/your-feature-name
   gh pr create --title "Feature: Your Feature" --body "Description"
   ```

4. **Wait for review** - Do not merge until approved

### Validation Required
Before reporting completion:
- Run `npm run lint`
- Run `npm run typecheck`
- Ensure all tests pass
- Push branch and create PR for review

---

## File Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── canvas/       # Canvas-related components
│   ├── sidebar/      # Sidebar components
│   ├── properties/   # Properties panel
│   ├── ui/           # Reusable UI components
│   └── layout/       # Header, Footer, etc.
├── stores/           # Zustand stores
├── lib/
│   ├── ai/          # AI providers & validation
│   ├── plants/      # Plant database
│   └── utils/       # Utilities
├── types/           # TypeScript types
└── data/            # Static data (plants.json)
```

---

## Documentation

- **SPEC.md** - Technical specification
- **AI Development Workflow.md** - Agent patterns
- **agents/** - Agent definitions

When updating code, update relevant documentation if interfaces change.
