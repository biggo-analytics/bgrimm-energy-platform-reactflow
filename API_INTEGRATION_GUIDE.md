# API Integration & Customization Guide

This guide explains how to integrate APIs, update energy values, customize styles, and modify the energy flow visualization components.

## 🚀 Quick Start

### Running the Application
```bash
npm start
```

The application includes a "Simulate API Update" button in the top-right corner for testing energy value updates.

## 📊 Energy Data Management

### Core Architecture

The application uses a centralized energy data management system with the following key files:

- **`src/energyData.js`** - Centralized energy data configuration
- **`src/useEnergyData.js`** - React hook for energy data management
- **`src/initial-elements.js`** - Dynamic node generation
- **`src/ImageNode.js`** - Energy value display component

### Energy Data Structure

```javascript
// src/energyData.js
export const energyData = {
  solar: {
    id: "solar",
    label: "Solar",
    value: 12.02,        // Energy value in kW
    unit: "kW",          // Energy unit
    icon: "https://...", // Icon URL
    position: { x: 0, y: 0 }
  },
  // ... other nodes
};
```

## 🔌 API Integration

### 1. Update Single Energy Value

```javascript
import { updateEnergyValue } from './src/energyData';
import { useEnergyData } from './src/useEnergyData';

// In your component
const { updateSingleValue } = useEnergyData(setNodes);

// Update solar panel energy
updateSingleValue('solar', 18.5); // Updates to 18.5 kW
```

### 2. Update Multiple Values

```javascript
const { updateValues } = useEnergyData(setNodes);

// Update multiple nodes at once
updateValues({
  solar: 20.3,
  battery: 65.7,
  load: 28.9,
  grid: 15.2
});
```

### 3. API Integration Example

```javascript
// Real API integration example
const { handleApiUpdate } = useEnergyData(setNodes);

// Fetch data from your API
const fetchEnergyData = async () => {
  try {
    const response = await fetch('/api/energy-data');
    const apiData = await response.json();

    // API response format:
    // [
    //   { id: 'solar', value: 22.5 },
    //   { id: 'battery', value: 58.3 },
    //   { id: 'load', value: 31.2 },
    //   { id: 'grid', value: 18.7 }
    // ]

    await handleApiUpdate(apiData);
  } catch (error) {
    console.error('Failed to fetch energy data:', error);
  }
};

// Call every 5 seconds for real-time updates
useEffect(() => {
  const interval = setInterval(fetchEnergyData, 5000);
  return () => clearInterval(interval);
}, []);
```

### 4. WebSocket Integration Example

```javascript
// Real-time WebSocket integration
const { handleApiUpdate } = useEnergyData(setNodes);

useEffect(() => {
  const ws = new WebSocket('ws://your-api-endpoint');

  ws.onmessage = (event) => {
    const energyData = JSON.parse(event.data);
    handleApiUpdate(energyData);
  };

  return () => ws.close();
}, [handleApiUpdate]);
```

## 🎨 Customization Guide

### 1. Changing Node Images

Update the icon URLs in `src/energyData.js`:

```javascript
export const energyData = {
  solar: {
    // ... other properties
    icon: "https://your-custom-icon.png", // Replace with your icon
  },
};
```

### 2. Modifying Node Positions

```javascript
export const energyData = {
  solar: {
    // ... other properties
    position: { x: 100, y: 50 }, // New position
  },
};
```

### 3. Customizing Flow Colors

Edit gradient definitions in `src/Flow.js`:

```javascript
{/* Custom gradient for solar flow */}
<linearGradient id="flow-solar" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stopColor="#your-color" stopOpacity={0} />
  <stop offset="50%" stopColor="#your-center-color" stopOpacity={1} />
  <stop offset="100%" stopColor="#your-color" stopOpacity={0} />
</linearGradient>
```

### 4. Adjusting Flow Animation

Modify flow properties in `src/initial-elements.js`:

```javascript
export const edges = [
  {
    id: "solar-to-load",
    // ... other properties
    data: {
      flowGradient: 'flow-solar',
      glowFilter: 'glow-solar',
      dashArray: '30 70',    // Longer flow lines
      duration: '1.5s'       // Faster animation
    }
  }
];
```

### 5. Styling Node Appearance

Edit `src/ImageNode.css` to customize node styling:

```css
.image-node {
  background: linear-gradient(145deg, #f0f0f0, #ffffff);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  /* Add your custom styles */
}

.node-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  /* Customize label appearance */
}
```

### 6. Adding New Node Types

1. **Add to energyData.js:**
```javascript
export const energyData = {
  // ... existing nodes
  inverter: {
    id: "inverter",
    label: "Inverter",
    value: 45.8,
    unit: "kW",
    icon: "https://your-inverter-icon.png",
    position: { x: 450, y: 200 }
  }
};
```

2. **Add edge connections in initial-elements.js:**
```javascript
export const edges = [
  // ... existing edges
  {
    id: "solar-to-inverter",
    source: "solar",
    target: "inverter",
    type: "animated",
    style: { stroke: 'url(#gradient-4)', strokeWidth: 4 },
    data: {
      flowGradient: 'flow-solar',
      glowFilter: 'glow-solar',
      dashArray: '25 75',
      duration: '2.5s'
    }
  }
];
```

## 🔧 Advanced Customization

### 1. Custom Energy Units

```javascript
// Support different energy units
export const energyData = {
  solar: {
    // ... other properties
    value: 12.02,
    unit: "MW",  // Change to MW, W, etc.
  }
};
```

### 2. Dynamic Styling Based on Values

```javascript
// In ImageNode.js
const getNodeStyle = (energyValue) => {
  if (energyValue > 50) return { border: '3px solid #ef4444' }; // High usage
  if (energyValue > 25) return { border: '3px solid #f59e0b' }; // Medium usage
  return { border: '3px solid #10b981' }; // Low usage
};
```

### 3. Custom Glow Effects

Add new glow filters in `src/Flow.js`:

```javascript
{/* Custom glow filter */}
<filter id="glow-custom" x="-20%" y="-20%" width="140%" height="140%">
  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
  <feColorMatrix values="1 0 0 0 0.2  0 1 0 0 0.8  0 0 1 0 0.2  0 0 0 1 0"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

## 📋 API Response Format

### Expected API Response Format

```json
[
  {
    "id": "solar",
    "value": 22.5,
    "unit": "kW",          // Optional
    "timestamp": "2024-01-15T10:30:00Z"  // Optional
  },
  {
    "id": "battery",
    "value": 58.3,
    "unit": "kW"
  },
  {
    "id": "load",
    "value": 31.2,
    "unit": "kW"
  },
  {
    "id": "grid",
    "value": 18.7,
    "unit": "kW"
  }
]
```

### Error Handling

```javascript
const { handleApiUpdate } = useEnergyData(setNodes);

const fetchWithErrorHandling = async () => {
  try {
    const response = await fetch('/api/energy-data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    await handleApiUpdate(data);

  } catch (error) {
    console.error('Energy data update failed:', error);
    // Handle error (show notification, retry, etc.)
  }
};
```

## 🧪 Testing

### Testing Energy Updates

Use the built-in simulate function:

```javascript
// In your component
const { simulateApiUpdate } = useEnergyData(setNodes);

// Simulate random energy values
const testUpdate = () => {
  simulateApiUpdate();
};
```

### Manual Testing

```javascript
// Test specific values
updateValues({
  solar: 0,      // Test zero value
  battery: 100,  // Test high value
  load: -5,      // Test negative value (if applicable)
  grid: 999.99   // Test edge case
});
```

## 🚀 Production Deployment

### Environment Variables

```bash
# .env file
REACT_APP_API_BASE_URL=https://your-api-endpoint.com
REACT_APP_WS_ENDPOINT=wss://your-websocket-endpoint.com
REACT_APP_UPDATE_INTERVAL=5000
```

### Performance Optimization

```javascript
// Debounce API calls
import { debounce } from 'lodash';

const debouncedUpdate = debounce(handleApiUpdate, 1000);
```

## 📁 File Structure

```
src/
├── energyData.js          # Energy data configuration
├── useEnergyData.js       # Energy management hook
├── initial-elements.js    # Nodes and edges configuration
├── ImageNode.js          # Node display component
├── ImageNode.css         # Node styling
├── AnimatedEdge.js       # Flow animation component
├── Flow.js               # Main flow container
├── Sidebar.js            # Component sidebar
└── App.js                # Main application
```

## 🤝 Contributing

When adding new features or modifications:

1. Update `energyData.js` for data changes
2. Use `useEnergyData` hook for state management
3. Follow the existing naming conventions
4. Test with the simulate API function
5. Update this documentation

---

For more detailed information about React Flow, visit the [official documentation](https://reactflow.dev/).