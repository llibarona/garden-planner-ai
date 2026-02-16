# Garden Planner AI - Technical Specification

## 1. Project Overview

**Project Name:** Garden Planner AI  
**Type:** Web Application (Next.js)  
**Core Functionality:** Visual drag-and-drop garden design tool with AI-powered validation and agronomic recommendations  
**Target Users:** Home gardeners, landscape enthusiasts, urban farmers

---

## 2. UI/UX Specification

### 2.1 Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  Header (64px) - Logo | Project Name | Save/Load | Export       │
├────────────┬─────────────────────────────────────┬───────────────┤
│            │                                     │               │
│  Sidebar   │         Canvas Area                │  Properties   │
│  (280px)   │       (flex-grow: 1)               │   (320px)     │
│            │                                     │               │
│  - Tools   │    [React-Konva Canvas]            │  - Selected   │
│  - Plants  │    - Grid background               │    Element    │
│  - Layers  │    - Zoom/Pan controls             │  - Context    │
│            │    - Drag-drop zone                │    Settings   │
│            │                                     │               │
├────────────┴─────────────────────────────────────┴───────────────┤
│  Footer (48px) - Status | Zoom Level | Coordinates              │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive Breakpoints
- **Desktop:** ≥1280px (full 3-column layout)
- **Tablet:** 768px-1279px (collapsible sidebars)
- **Mobile:** <768px (single column, bottom sheet panels)

### 2.3 Visual Design

**Color Palette:**
| Role | Color | Hex |
|------|-------|-----|
| Primary | Forest Green | `#2D5A27` |
| Primary Light | Sage | `#7CB342` |
| Secondary | Earth Brown | `#8D6E63` |
| Accent | Sunflower | `#FFB300` |
| Background | Cream | `#FAF8F5` |
| Surface | White | `#FFFFFF` |
| Text Primary | Charcoal | `#2C2C2C` |
| Text Secondary | Gray | `#6B6B6B` |
| Error | Coral Red | `#E53935` |
| Success | Leaf Green | `#43A047` |

**Typography:**
- **Headings:** "Outfit" (Google Fonts) - 700 weight
- **Body:** "DM Sans" (Google Fonts) - 400/500 weight
- **Monospace:** "JetBrains Mono" (for measurements)

**Spacing System:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)

**Visual Effects:**
- Card shadows: `0 2px 8px rgba(0,0,0,0.08)`
- Hover shadows: `0 4px 16px rgba(0,0,0,0.12)`
- Border radius: 8px (cards), 4px (buttons), 12px (modals)
- Transitions: 200ms ease-out

### 2.4 Components

| Component | States | Behavior |
|-----------|--------|----------|
| Plant Card | default, hover, selected, disabled | Click to select, drag to canvas |
| Tool Button | default, hover, active, disabled | Toggle mode on canvas |
| Layer Toggle | visible, hidden, locked | Checkbox + lock icon |
| Input Field | default, focus, error, disabled | Label + validation message |
| Slider | default, dragging | For zoom/rotation |
| Modal | open/closed | Backdrop click to close |
| Toast | info, success, warning, error | Auto-dismiss 5s |

---

## 3. Functionality Specification

### 3.1 Core Features

#### 3.1.1 Canvas System
- **Zoom:** 25% - 400% (scroll wheel + buttons)
- **Pan:** Middle-click drag or spacebar + drag
- **Grid:** Optional snap-to-grid (configurable size: 10cm, 25cm, 50cm, 1m)
- **Rulers:** Optional on X/Y axes (cm/m or ft/in)

#### 3.1.2 Terrain Definition
- **Rectangle:** Width × Height input
- **Circle:** Radius input
- **Polygon:** Click to add points, close shape
- **Units:** Metric (cm, m) or Imperial (in, ft) - configurable

#### 3.1.3 Layers
| Layer | Description | Default Z-index |
|-------|-------------|------------------|
| Base | Terrain background | 0 |
| Soil | Ground cover, mulch | 10 |
| Plants | All placed plants | 20 |
| Infrastructure | Paths, fountains, furniture | 30 |
| Annotations | Labels, notes | 40 |

#### 3.1.4 Plant Database
```typescript
interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'tree' | 'shrub' | 'flower' | 'vegetable' | 'herb' | 'grass' | 'succulent';
  sunlight: 'full-sun' | 'partial-shade' | 'shade';
  soilPh: { min: number; max: number };
  waterNeeds: 'low' | 'medium' | 'high';
  size: { width: number; height: number; unit: 'cm' };
  hardinessZone: { min: number; max: number };
  growthRate: 'slow' | 'medium' | 'fast';
  companionPlants: string[];
  incompatiblePlants: string[];
  seasons: ('spring' | 'summer' | 'autumn' | 'winter')[];
  imageUrl?: string;
  notes?: string;
}
```

#### 3.1.5 Context Settings (Climate/Soil)
```typescript
interface GardenContext {
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  } | null;
  climate: {
    zone: number;
    type: 'tropical' | 'subtropical' | 'mediterranean' | 'temperate' | 'continental' | 'arid';
  };
  soil: {
    type: 'clay' | 'sandy' | 'loamy' | 'chalky' | 'peaty' | 'silty';
    ph: number;
    drainage: 'poor' | 'moderate' | 'good' | 'excellent';
  };
  sunExposure: {
    north: 'sun' | 'shade';
    south: 'sun' | 'shade';
    east: 'sun' | 'shade';
    west: 'sun' | 'shade';
  };
}
```

### 3.2 AI System Architecture

#### 3.2.1 Provider Interface
```typescript
interface AIProvider {
  name: string;
  type: 'local' | 'api' | 'custom';
  
  validatePlacement(plants: PlacedPlant[], context: GardenContext): Promise<ValidationResult>;
  recommendCompanions(plantId: string, context: GardenContext): Promise<Plant[]>;
  analyzeViability(garden: Garden): Promise<ViabilityReport>;
  generateCalendar(garden: Garden): Promise<CalendarEvent[]>;
}

interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  warnings: ValidationWarning[];
}

interface ValidationIssue {
  type: 'spacing' | 'sunlight' | 'soil' | 'incompatible' | 'zone';
  severity: 'error' | 'warning';
  message: string;
  plantIds: string[];
  suggestion?: string;
}
```

#### 3.2.2 Built-in Providers
1. **Rule-Based Local** - No external API, uses plant database rules
2. **OpenAI Compatible** - Connect to any OpenAI-compatible endpoint
3. **Custom** - User can register their own provider

#### 3.2.3 Configuration
```typescript
interface AppConfig {
  ai: {
    provider: string;
    apiKey?: string;
    endpoint?: string;
    model?: string;
    temperature?: number;
  };
  display: {
    unit: 'metric' | 'imperial';
    gridSize: number;
    showGrid: boolean;
    showRulers: boolean;
    theme: 'light' | 'dark';
  };
  canvas: {
    defaultWidth: number;
    defaultHeight: number;
  };
}
```

### 3.3 Data Flow

```
User Action → Canvas Event → State Update → Validation → UI Render
                                     ↓
                              AI Analysis (async)
                                     ↓
                              Results → Toast/Panel
```

### 3.4 Persistence
- **Auto-save:** LocalStorage every 30 seconds
- **Export:** JSON file (full project), PNG/PDF (visual)
- **Import:** Load JSON project files

---

## 4. Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Canvas | React-Konva |
| State | Zustand |
| Icons | Lucide React |
| Date/Time | date-fns |
| Forms | React Hook Form + Zod |
| Storage | LocalStorage + File System Access API |

---

## 5. File Structure

```
garden-planner-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── GardenCanvas.tsx
│   │   │   ├── CanvasLayers.tsx
│   │   │   ├── TerrainShape.tsx
│   │   │   └── PlantObject.tsx
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── PlantLibrary.tsx
│   │   │   ├── ToolPicker.tsx
│   │   │   └── LayerPanel.tsx
│   │   ├── properties/
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── PlantProperties.tsx
│   │   │   └── ContextSettings.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── stores/
│   │   ├── gardenStore.ts
│   │   ├── canvasStore.ts
│   │   └── configStore.ts
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── providers/
│   │   │   │   ├── ruleBased.ts
│   │   │   │   └── openAi.ts
│   │   │   ├── AIProvider.ts
│   │   │   └── validation.ts
│   │   ├── plants/
│   │   │   └── plantDatabase.ts
│   │   └── utils/
│   │       ├── measurements.ts
│   │       └── export.ts
│   ├── types/
│   │   └── index.ts
│   └── data/
│       └── plants.json
├── public/
│   └── plants/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 6. Acceptance Criteria

### MVP
- [ ] User can create new project with custom dimensions
- [ ] User can add rectangle/circle terrain to canvas
- [ ] User can drag plants from library onto canvas
- [ ] Selected plant shows properties panel with edit options
- [ ] User can move/rotate/scale placed plants
- [ ] Plants show validation warnings (sunlight, spacing)
- [ ] Context settings (climate/soil) are editable
- [ ] Project saves to LocalStorage
- [ ] Project exports to JSON

### Phase 2
- [ ] AI provider abstraction works
- [ ] Rule-based validation provides companion suggestions
- [ ] Export to PNG works
- [ ] Layers can be toggled visible/hidden

### Phase 3+
- [ ] OpenAI-compatible API integration
- [ ] Google Maps location import
- [ ] Calendar export (.ics)
