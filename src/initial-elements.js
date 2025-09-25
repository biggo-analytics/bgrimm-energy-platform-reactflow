
import { MarkerType } from "reactflow";

// URL รูปภาพ Placeholder (สามารถเปลี่ยนได้)
const solarIconUrl = "https://cdn-icons-png.flaticon.com/512/3463/3463440.png";
const batteryIconUrl =
  "   https://cdn-icons-png.flaticon.com/512/1687/1687413.png";
const loadIconUrl = "https://cdn-icons-png.flaticon.com/512/2801/2801682.png";
const gridIconUrl = "https://cdn-icons-png.flaticon.com/512/4882/4882999.png";

export const nodes = [
  {
    id: "solar",
    type: "imageNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Solar",
      value: "12.02 kW",
      imageUrl: solarIconUrl,
    },
  },
  {
    id: "battery",
    type: "imageNode",
    position: { x: 0, y: 250 },
    data: {
      label: "Battery",
      value: "55.34 kW",
      imageUrl: batteryIconUrl,
    },
  },
  {
    id: "load",
    type: "imageNode",
    position: { x: 300, y: 125 },
    data: {
      label: "Load",
      value: "23.02 kW",
      imageUrl: loadIconUrl,
    },
  },
  {
    id: "grid",
    type: "imageNode",
    position: { x: 600, y: 250 },
    data: {
      label: "Grid",
      value: "16.12 kW",
      imageUrl: gridIconUrl,
    },
  },
];

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
