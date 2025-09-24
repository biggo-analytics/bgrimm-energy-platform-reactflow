# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server (React Scripts)
- `npm run build` - Build production bundle
- `npm test` - Run tests with Jest
- `npm run eject` - Eject from Create React App (irreversible)

## Project Architecture

This is a React Flow-based energy management visualization application built with Create React App. The application demonstrates an interactive flow diagram for energy systems (solar, battery, load, grid).

### Core Components Structure

**Flow.js** - Main application logic containing:
- ReactFlow instance with custom node and edge types
- State management for nodes, edges, and modals
- Drag-and-drop functionality from sidebar to canvas
- Node selection and settings panel integration
- Double-click handlers for node/edge editing
- Custom edge connection logic with animated edges

**Custom Node System:**
- `ImageNode.js` - Custom node component with image icons, labels, and values
- `initial-elements.js` - Defines initial nodes (solar, battery, load, grid) and edges
- Nodes use external icon URLs from flaticon.com
- Each node has configurable label, value, and imageUrl properties

**UI Components:**
- `Sidebar.js` - Draggable component library with predefined energy system components
- `SettingsPanel.js` - Right panel for editing selected node properties
- `NodeModal.js` - Modal for editing node properties via double-click
- `EdgeModal.js` - Modal for editing edge labels via double-click
- `AnimatedEdge.js` - Custom animated edge component with gradient styling

### State Management Pattern

The application uses React hooks for state management:
- `useNodesState` and `useEdgesState` from ReactFlow for flow state
- Local state for modals, selected nodes, and UI interactions
- Custom `handleNodesChange` to track node selection for settings panel
- Callback-based communication between components

### Key Features

- Drag-and-drop from sidebar to create new nodes
- Double-click editing for nodes and edges
- Real-time node property editing via settings panel
- Animated edges with custom styling and gradients
- Node and edge deletion with proper cleanup
- Responsive layout with fixed sidebar and settings panel widths (250px left, 300px right)

### Styling Architecture

- CSS modules for component-specific styling
- Custom CSS for ImageNode, Sidebar, SettingsPanel, and NodeModal
- ReactFlow default styles imported globally
- Custom SVG gradients defined inline for edge styling