// Energy data configuration for easy API integration
export const energyData = {
  solar: {
    id: "solar",
    label: "Solar",
    value: 12.02,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/3463/3463440.png",
    position: { x: 0, y: 0 }
  },
  battery: {
    id: "battery",
    label: "Battery",
    value: 55.34,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/1687/1687413.png",
    position: { x: 0, y: 250 }
  },
  load: {
    id: "load",
    label: "Load",
    value: 23.02,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/2801/2801682.png",
    position: { x: 300, y: 125 }
  },
  grid: {
    id: "grid",
    label: "Grid",
    value: 16.12,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/4882/4882999.png",
    position: { x: 600, y: 250 }
  }
};

// Utility functions for energy data management
export const updateEnergyValue = (nodeId, newValue) => {
  if (energyData[nodeId]) {
    energyData[nodeId].value = newValue;
    return true;
  }
  return false;
};

export const getEnergyValue = (nodeId) => {
  return energyData[nodeId]?.value || 0;
};

export const getFormattedValue = (nodeId) => {
  const data = energyData[nodeId];
  if (!data) return "0 kW";
  return `${data.value.toFixed(2)} ${data.unit}`;
};

export const getAllEnergyValues = () => {
  return Object.keys(energyData).reduce((acc, key) => {
    acc[key] = energyData[key].value;
    return acc;
  }, {});
};

export const updateMultipleValues = (updates) => {
  const results = {};
  Object.entries(updates).forEach(([nodeId, value]) => {
    results[nodeId] = updateEnergyValue(nodeId, value);
  });
  return results;
};

// API integration helper - format for external API calls
export const prepareApiData = () => {
  return Object.values(energyData).map(node => ({
    id: node.id,
    label: node.label,
    value: node.value,
    unit: node.unit
  }));
};

// API response handler - update from external API
export const handleApiResponse = (apiData) => {
  const updates = {};
  apiData.forEach(item => {
    if (energyData[item.id]) {
      energyData[item.id].value = item.value;
      updates[item.id] = item.value;
    }
  });
  return updates;
};