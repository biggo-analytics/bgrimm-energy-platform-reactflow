import { nodeRedConfig } from './nodeRedConfig';

// Energy data configuration - now integrated with Node-RED config
export const energyData = {
  solar: {
    id: "solar",
    nodeRedId: "outputActivePower",
    label: "Solar",
    value: 12.02,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/3463/3463440.png",
    position: { x: 0, y: 0 },
    // Node-RED Modbus configuration
    modbusConfig: {
      type: nodeRedConfig.outputActivePower.type,
      dataType: nodeRedConfig.outputActivePower.dataType,
      address: nodeRedConfig.outputActivePower.address,
      quantity: nodeRedConfig.outputActivePower.quantity,
      rate: nodeRedConfig.outputActivePower.rate,
      rateUnit: nodeRedConfig.outputActivePower.rateUnit,
      server: nodeRedConfig.outputActivePower.server,
      serverId: nodeRedConfig.outputActivePower.serverId,
      scaleFactor: nodeRedConfig.outputActivePower.scaleFactor,
      isSigned: nodeRedConfig.outputActivePower.isSigned,
      topic: nodeRedConfig.outputActivePower.topic
    }
  },
  battery: {
    id: "battery",
    nodeRedId: "batteryPower",
    label: "Battery",
    value: 55.34,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/1687/1687413.png",
    position: { x: 0, y: 250 },
    // Node-RED Modbus configuration
    modbusConfig: {
      type: nodeRedConfig.batteryPower.type,
      dataType: nodeRedConfig.batteryPower.dataType,
      address: nodeRedConfig.batteryPower.address,
      quantity: nodeRedConfig.batteryPower.quantity,
      rate: nodeRedConfig.batteryPower.rate,
      rateUnit: nodeRedConfig.batteryPower.rateUnit,
      server: nodeRedConfig.batteryPower.server,
      serverId: nodeRedConfig.batteryPower.serverId,
      scaleFactor: nodeRedConfig.batteryPower.scaleFactor,
      isSigned: nodeRedConfig.batteryPower.isSigned,
      topic: nodeRedConfig.batteryPower.topic
    }
  },
  load: {
    id: "load",
    nodeRedId: "loadActivePower",
    label: "Load",
    value: 23.02,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/2801/2801682.png",
    position: { x: 300, y: 125 },
    // Node-RED Modbus configuration
    modbusConfig: {
      type: nodeRedConfig.loadActivePower.type,
      dataType: nodeRedConfig.loadActivePower.dataType,
      address: nodeRedConfig.loadActivePower.address,
      quantity: nodeRedConfig.loadActivePower.quantity,
      rate: nodeRedConfig.loadActivePower.rate,
      rateUnit: nodeRedConfig.loadActivePower.rateUnit,
      server: nodeRedConfig.loadActivePower.server,
      serverId: nodeRedConfig.loadActivePower.serverId,
      scaleFactor: nodeRedConfig.loadActivePower.scaleFactor,
      isSigned: nodeRedConfig.loadActivePower.isSigned,
      topic: nodeRedConfig.loadActivePower.topic
    }
  },
  grid: {
    id: "grid",
    nodeRedId: "activePowerInv",
    label: "Grid",
    value: 16.12,
    unit: "kW",
    icon: "https://cdn-icons-png.flaticon.com/512/4882/4882999.png",
    position: { x: 600, y: 250 },
    // Node-RED Modbus configuration
    modbusConfig: {
      type: nodeRedConfig.activePowerInv.type,
      dataType: nodeRedConfig.activePowerInv.dataType,
      address: nodeRedConfig.activePowerInv.address,
      quantity: nodeRedConfig.activePowerInv.quantity,
      rate: nodeRedConfig.activePowerInv.rate,
      rateUnit: nodeRedConfig.activePowerInv.rateUnit,
      server: nodeRedConfig.activePowerInv.server,
      serverId: nodeRedConfig.activePowerInv.serverId,
      serverHost: nodeRedConfig.activePowerInv.serverHost,
      serverPort: nodeRedConfig.activePowerInv.serverPort,
      scaleFactor: nodeRedConfig.activePowerInv.scaleFactor,
      isSigned: nodeRedConfig.activePowerInv.isSigned,
      topic: nodeRedConfig.activePowerInv.topic
    }
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