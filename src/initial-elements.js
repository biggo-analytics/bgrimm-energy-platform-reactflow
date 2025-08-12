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
    markerEnd: { type: MarkerType.ArrowClosed },
    type: "animated",
    label: "Solar to Load",
  },
  {
    id: "solar-to-battery",
    source: "solar",
    target: "battery",
    markerEnd: { type: MarkerType.ArrowClosed },
    type: "animated",
    label: "Solar to Battery",
  },
  {
    id: "grid-to-load",
    source: "grid",
    target: "load",
    markerEnd: { type: MarkerType.ArrowClosed },
    type: "animated",
    label: "Grid to Load",
  },
];
