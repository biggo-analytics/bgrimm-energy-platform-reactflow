# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Flow proof-of-concept application for an energy system aggregator business. It demonstrates an interactive diagram showing energy flow between components like Solar, Battery, Load, and Grid systems with drag-and-drop functionality.

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Extract configuration (if needed)
npm run eject
```

## Architecture

### Core Components

- **App.js**: Main application entry point that renders the Flow component
- **Flow.js**: Primary ReactFlow container with drag-and-drop functionality, manages nodes and edges state
- **Sidebar.js**: Draggable component palette containing energy system components (Solar, Battery, Load, Grid)
- **ImageNode.js**: Custom ReactFlow node type that displays energy components with images, values, and labels
- **AnimatedEdge.js**: Custom edge type for animated connections between components
- **initial-elements.js**: Default nodes and edges configuration for the energy flow diagram

### Key Features

1. **Drag & Drop System**: Components can be dragged from the sidebar and dropped onto the flow canvas
2. **Custom Node Types**: Energy components are rendered as image nodes with power values
3. **Animated Edges**: Connections between components use animated edges to show energy flow
4. **ReactFlow Integration**: Uses ReactFlow v11 with MiniMap, Controls, and Background components

### File Structure

```
src/
├── App.js              # Main app component
├── Flow.js             # ReactFlow wrapper with drag-drop logic
├── Sidebar.js          # Component palette with draggable items
├── ImageNode.js        # Custom node component
├── ImageNode.css       # Node styling
├── AnimatedEdge.js     # Custom edge component
├── initial-elements.js # Initial nodes and edges data
├── Sidebar.css         # Sidebar styling
├── styles.css          # Global styles
└── index.js            # React entry point
```

### Data Structure

- **Nodes**: Energy components with `type: "imageNode"`, position, and data containing label, value, and imageUrl
- **Edges**: Connections between nodes with animated type and source/target references
- **Component Types**: Solar, Battery, Load, Grid - each with specific icons and power values

### Styling

- Uses CSS modules for component-specific styling
- ReactFlow default styles imported from 'reactflow/dist/style.css'
- Custom gradient definitions for animated edges
- Sidebar positioned with fixed width (250px) and full height

### State Management

- Uses ReactFlow hooks: `useNodesState` and `useEdgesState` for managing flow state
- Local component state only - no external state management library
- Drag-and-drop data transfer using browser DataTransfer API