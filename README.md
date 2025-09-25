# Energy Aggregator React Flow POC

A React Flow-based proof-of-concept for visualizing energy system aggregator data with dynamic updates and animated flow representations.

## 🌟 Features

- **Interactive Energy Flow Diagram** - Visual representation of energy flow between Solar, Battery, Load, and Grid systems
- **Animated Gradient Edges** - Beautiful flowing animations with unique colors for each energy source
- **Dynamic Energy Updates** - Real-time energy value updates with API integration support
- **Drag & Drop Interface** - Add new components from the sidebar
- **Centralized Data Management** - Easy-to-update energy configurations
- **Customizable Styling** - Flexible theming and visual customization options

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📖 Documentation

- **[API Integration & Customization Guide](./API_INTEGRATION_GUIDE.md)** - Comprehensive guide for API integration, styling customization, and advanced features

## 🔧 Tech Stack

- React 18.1.0
- React Flow 11.10.1
- SVG Animations
- CSS3 with custom styling

## 🎨 Visual Features

- **Solar Flow**: Orange gradient with dynamic glow effects
- **Battery Flow**: Solid green gradient throughout
- **Grid Flow**: Gray gradient with white center highlights
- **Base Paths**: Muted gray background for clean appearance
- **Glow Effects**: Customizable blur effects for each flow type

## 🔌 API Ready

The application is designed for easy API integration with:
- Centralized energy data management
- Real-time value updates
- WebSocket support
- Error handling
- Testing utilities

## 📁 Project Structure

```
src/
├── energyData.js          # Centralized energy configuration
├── useEnergyData.js       # Energy management React hook
├── initial-elements.js    # Dynamic nodes and edges
├── ImageNode.js          # Energy display components
├── AnimatedEdge.js       # Flow animations
├── Flow.js               # Main flow container
└── components/           # UI components
```

Created with CodeSandbox
