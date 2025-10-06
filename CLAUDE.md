# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Flow-based proof-of-concept for visualizing energy system aggregator data with real-time updates and animated flow representations. The application demonstrates energy flow between Solar, Battery, Load, and Grid components with drag-and-drop functionality and API integration support.

## Development Commands

```bash
# Start development server (port 3000 by default)
npm start

# Build for production
npm run build

# Run tests with Jest
npm test
```

## Architecture

### Centralized Energy Data Management

The application uses a centralized data management pattern that separates data from presentation:

1. **[energyData.js](src/energyData.js)** - Single source of truth for all energy component configurations (values, labels, positions, icons)
2. **[useEnergyData.js](src/useEnergyData.js)** - React hook that manages state updates and provides API integration methods
3. **[initial-elements.js](src/initial-elements.js)** - Generates ReactFlow nodes and edges from centralized energy data

This architecture enables:

- Easy API integration without touching UI components
- Centralized value updates that automatically propagate to all nodes
- Separation of concerns between data and presentation layers

### Key Data Flow

```text
API Response → useEnergyData hook → energyData.js (updates) →
initial-elements.js (regenerates nodes) → setNodes() → UI updates
```

When integrating with real APIs:

1. Use `handleApiUpdate()` from `useEnergyData` hook with API response format: `[{id: 'solar', value: 22.5}, ...]`
2. Energy data automatically updates in [energyData.js](src/energyData.js)
3. Nodes regenerate via `updateNodesWithEnergyData()` in [initial-elements.js](src/initial-elements.js)
4. ReactFlow re-renders with new values

### Custom ReactFlow Components

- **[ImageNode.js](src/ImageNode.js)** - Custom node type displaying energy component icon, label, and real-time power value
- **[AnimatedEdge.js](src/AnimatedEdge.js)** - Custom edge with configurable animated gradients and glow effects
  - Each edge has unique gradient (flow-solar, flow-battery, flow-grid) and glow filter
  - Animation properties (dashArray, duration) are configurable per edge via `data` prop
  - Base path + animated overlay pattern for visual depth

### SVG Gradient System

All gradient and glow filter definitions are in [Flow.js](src/Flow.js) within the ReactFlow `<svg><defs>` section:

- Static gradients (gradient-1 through gradient-4) for base edge colors
- Flow gradients (flow-solar, flow-battery, flow-grid) for animated overlays
- Glow filters (glow-solar, glow-battery, glow-grid) for edge effects

To add new edge types or modify colors, update both the gradient definitions in [Flow.js](src/Flow.js) and edge data in [initial-elements.js](src/initial-elements.js).

### Component Structure

```text
Flow.js (ReactFlowProvider wrapper)
├── Sidebar.js (draggable component palette)
└── ReactFlow
    ├── Custom nodes (ImageNode)
    ├── Custom edges (AnimatedEdge)
    ├── SVG gradient/filter definitions
    └── MiniMap, Controls, Background
```

## API Integration

See [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) for comprehensive integration details.

### Quick Integration Pattern

```javascript
import { useEnergyData } from './src/useEnergyData';

const { handleApiUpdate } = useEnergyData(setNodes);

// REST API polling
const fetchData = async () => {
  const response = await fetch('/api/energy-data');
  const data = await response.json();
  await handleApiUpdate(data); // Format: [{id: 'solar', value: 22.5}, ...]
};

// WebSocket real-time updates
const ws = new WebSocket('ws://endpoint');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  handleApiUpdate(data);
};
```

## Customization

### Adding New Energy Components

1. Add node configuration to [energyData.js](src/energyData.js)
2. Add edge connections to [initial-elements.js](src/initial-elements.js)
3. (Optional) Define custom gradient/glow in [Flow.js](src/Flow.js)

### Modifying Flow Animations

Edge animation properties are in [initial-elements.js](src/initial-elements.js) `edges` array:

- `dashArray` - Controls flow segment length (e.g., '25 75' = 25% visible, 75% gap)
- `duration` - Animation speed (e.g., '2.5s')
- `flowGradient` - References gradient ID from Flow.js
- `glowFilter` - References filter ID from Flow.js

## Tech Stack

- React 18.1.0
- React Flow 11.10.1 (node-based diagram library)
- react-scripts 5.0.1 (Create React App)
- SVG animations for edge effects
