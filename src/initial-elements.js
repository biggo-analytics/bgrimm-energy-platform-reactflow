
import { MarkerType } from "reactflow";
import { energyData, getFormattedValue } from "./energyData";

// Generate nodes from energy data configuration
export const nodes = Object.values(energyData).map(nodeData => ({
  id: nodeData.id,
  type: "imageNode",
  position: nodeData.position,
  data: {
    label: nodeData.label,
    value: getFormattedValue(nodeData.id),
    imageUrl: nodeData.icon,
    // Store raw energy value for easy updates
    energyValue: nodeData.value,
    energyUnit: nodeData.unit
  }
}));

// Function to update nodes with new energy values
export const updateNodesWithEnergyData = () => {
  return Object.values(energyData).map(nodeData => ({
    id: nodeData.id,
    type: "imageNode",
    position: nodeData.position,
    data: {
      label: nodeData.label,
      value: getFormattedValue(nodeData.id),
      imageUrl: nodeData.icon,
      energyValue: nodeData.value,
      energyUnit: nodeData.unit
    }
  }));
};

export const edges = [
  {
    id: "solar-to-load",
    source: "solar",
    target: "load",
    type: "animated",
    style: { stroke: 'url(#gradient-1)', strokeWidth: 4 },
    data: {
      flowGradient: 'flow-solar',
      glowFilter: 'glow-solar',
      dashArray: '25 75',
      duration: '2.5s'
    }
  },
  {
    id: "battery-to-load",
    source: "battery",
    target: "load",
    type: "animated",
    style: { stroke: 'url(#gradient-2)', strokeWidth: 4 },
    data: {
      flowGradient: 'flow-battery',
      glowFilter: 'glow-battery',
      dashArray: '20 80',
      duration: '1.8s'
    }
  },
  {
    id: "grid-to-load",
    source: "grid",
    target: "load",
    type: "animated",
    style: { stroke: 'url(#gradient-3)', strokeWidth: 4 },
    data: {
      flowGradient: 'flow-grid',
      glowFilter: 'glow-grid',
      dashArray: '30 70',
      duration: '3s'
    }
  },
];
