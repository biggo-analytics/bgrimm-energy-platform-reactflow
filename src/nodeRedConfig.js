// Node-RED flow configuration mapping
// This file maps Node-RED Modbus nodes to React Flow visualization

export const nodeRedConfig = {
  outputActivePower: {
    id: "outputActivePower",
    nodeRedId: "89e6ba0316f7f4d6",
    label: "Output Active Power",
    displayLabel: "Solar",
    type: "modbus-read",
    dataType: "InputRegister",
    address: 78,
    quantity: 10,
    rate: 3,
    rateUnit: "s",
    server: "RTU",
    serverId: "2adc9ba4547ee9b4",
    scaleFactor: 0.1,
    unit: "kW",
    isSigned: true,
    defaultValue: 12.02,
    icon: "https://cdn-icons-png.flaticon.com/512/3463/3463440.png",
    position: { x: 0, y: 0 },
    color: "#FFD700", // Gold for Solar
    topic: "OutputActivePower"
  },
  loadActivePower: {
    id: "loadActivePower",
    nodeRedId: "b045a79a6a6117ee",
    label: "Load Active Power",
    displayLabel: "Load",
    type: "modbus-read",
    dataType: "InputRegister",
    address: 48,
    quantity: 10,
    rate: 3,
    rateUnit: "s",
    server: "RTU",
    serverId: "2adc9ba4547ee9b4",
    scaleFactor: 0.1,
    unit: "kW",
    isSigned: true,
    defaultValue: 23.02,
    icon: "https://cdn-icons-png.flaticon.com/512/2801/2801682.png",
    position: { x: 300, y: 125 },
    color: "#FFA500", // Orange for Load
    topic: "LoadActivePower"
  },
  batteryPower: {
    id: "batteryPower",
    nodeRedId: "3e1dd2223b1d3e88",
    label: "Battery Power",
    displayLabel: "Battery",
    type: "modbus-read",
    dataType: "InputRegister",
    address: 16,
    quantity: 10,
    rate: 3,
    rateUnit: "s",
    server: "RTU",
    serverId: "2adc9ba4547ee9b4",
    scaleFactor: 0.1,
    unit: "kW",
    isSigned: true,
    defaultValue: 55.34,
    icon: "https://cdn-icons-png.flaticon.com/512/1687/1687413.png",
    position: { x: 0, y: 250 },
    color: "#9370DB", // Purple for Battery
    topic: "BatteryPower"
  },
  activePowerInv: {
    id: "activePowerInv",
    nodeRedId: "105bdfba723070db",
    label: "Active Power Inverter",
    displayLabel: "Grid",
    type: "modbus-read",
    dataType: "HoldingRegister",
    address: 40525,
    quantity: 2,
    rate: 3,
    rateUnit: "s",
    server: "TCP",
    serverId: "3e10b1e9e258cd2b",
    serverHost: "172.28.12.11",
    serverPort: 502,
    scaleFactor: 1, // May need adjustment based on inverter specs
    unit: "kW",
    isSigned: true,
    defaultValue: 16.12,
    icon: "https://cdn-icons-png.flaticon.com/512/4882/4882999.png",
    position: { x: 600, y: 250 },
    color: "#32CD32", // Green for Grid
    topic: "ActivePowerInv"
  }
};

// Modbus server configurations
export const modbusServers = {
  "2adc9ba4547ee9b4": {
    id: "2adc9ba4547ee9b4",
    name: "RTU",
    type: "simpleser",
    serialPort: "/dev/ttyUSB0",
    serialType: "RTU",
    baudrate: 9600,
    databits: 8,
    stopbits: 1,
    parity: "none",
    unitId: 1,
    timeout: 1000,
    reconnectTimeout: 2000
  },
  "3e10b1e9e258cd2b": {
    id: "3e10b1e9e258cd2b",
    name: "TCP",
    type: "tcp",
    host: "172.28.12.11",
    port: 502,
    unitId: 50,
    timeout: 1000,
    reconnectTimeout: 2000
  }
};

// Node-RED flow connections (wires)
// Maps source node to target nodes
export const flowConnections = {
  outputActivePower: [], // No direct connections in original flow, goes to function then debug
  loadActivePower: [], // Same as above
  batteryPower: [], // Same as above
  activePowerInv: [] // Same as above
};

// For React Flow, we'll create logical connections based on energy flow
export const logicalConnections = [
  {
    id: "solar-to-load",
    source: "outputActivePower",
    target: "loadActivePower",
    label: "Solar → Load",
    color: "#FFD700"
  },
  {
    id: "battery-to-load",
    source: "batteryPower",
    target: "loadActivePower",
    label: "Battery → Load",
    color: "#9370DB"
  },
  {
    id: "grid-to-load",
    source: "activePowerInv",
    target: "loadActivePower",
    label: "Grid → Load",
    color: "#32CD32"
  }
];

// Helper function to parse Modbus register value (signed 16-bit)
export const parseModbusValue = (raw, isSigned = true, scaleFactor = 0.1) => {
  let value = raw;

  // Convert to signed 16-bit if needed
  if (isSigned && (value & 0x8000)) {
    value = value - 0x10000;
  }

  // Apply scale factor
  return value * scaleFactor;
};

// Helper function to get node config by display name (for backward compatibility)
export const getNodeByDisplayName = (displayName) => {
  const mapping = {
    'Solar': 'outputActivePower',
    'Load': 'loadActivePower',
    'Battery': 'batteryPower',
    'Grid': 'activePowerInv'
  };

  const configKey = mapping[displayName];
  return configKey ? nodeRedConfig[configKey] : null;
};

// Export all node configs as array
export const getAllNodeConfigs = () => Object.values(nodeRedConfig);

// Get node config by ID
export const getNodeConfig = (nodeId) => nodeRedConfig[nodeId];

// Update node configuration
export const updateNodeConfig = (nodeId, updates) => {
  if (nodeRedConfig[nodeId]) {
    nodeRedConfig[nodeId] = { ...nodeRedConfig[nodeId], ...updates };
    return true;
  }
  return false;
};
