// Export React Flow configuration to Node-RED flows.json format

import { nodeRedConfig, modbusServers } from './nodeRedConfig';

/**
 * Generate a unique Node-RED compatible ID
 */
const generateNodeRedId = () => {
  return Math.random().toString(16).substring(2, 18);
};

/**
 * Convert React Flow node to Node-RED modbus-read node
 */
const convertToModbusReadNode = (reactNode, position) => {
  const nodeConfig = Object.values(nodeRedConfig).find(
    config => config.displayLabel === reactNode.data.label
  );

  if (!nodeConfig) {
    console.warn(`No Node-RED config found for ${reactNode.data.label}`);
    return null;
  }

  const modbusConfig = reactNode.data.modbusConfig || nodeConfig;

  return {
    id: generateNodeRedId(),
    type: "modbus-read",
    z: "", // Will be set to flow tab ID
    name: modbusConfig.topic || reactNode.data.label,
    topic: "",
    showStatusActivities: false,
    logIOActivities: false,
    showErrors: false,
    showWarnings: true,
    unitid: "",
    dataType: modbusConfig.dataType,
    adr: String(modbusConfig.address),
    quantity: String(modbusConfig.quantity),
    rate: String(modbusConfig.rate),
    rateUnit: modbusConfig.rateUnit || "s",
    delayOnStart: false,
    startDelayTime: "",
    server: modbusConfig.serverId,
    useIOFile: false,
    ioFile: "",
    useIOForPayload: false,
    emptyMsgOnFail: false,
    x: position.x,
    y: position.y,
    wires: [[], []] // Will be populated with function node connections
  };
};

/**
 * Create a function node to parse Modbus data
 */
const createFunctionNode = (reactNode, position, modbusConfig) => {
  const scaleFactor = modbusConfig.scaleFactor || 0.1;
  const topic = modbusConfig.topic || reactNode.data.label;
  const isSigned = modbusConfig.isSigned !== undefined ? modbusConfig.isSigned : true;

  const functionCode = `// ---- Function Node: Parse ${topic} ----
let data = msg.payload;

if (!Array.isArray(data) || data.length === 0) {
    node.error("ไม่พบค่า register", msg);
    return null;
}

// index 0 = address ${modbusConfig.address}
let raw = data[0];

${isSigned ? `// Convert to signed 16-bit
if (raw & 0x8000) {
    raw = raw - 0x10000;
}` : ''}

// Apply scale factor
let value_kW = raw * ${scaleFactor};

msg.topic = "${topic}";
msg.payload = value_kW;

return msg;`;

  return {
    id: generateNodeRedId(),
    type: "function",
    z: "",
    name: `Parse ${topic}`,
    func: functionCode,
    outputs: 1,
    timeout: 0,
    noerr: 0,
    initialize: "",
    finalize: "",
    libs: [],
    x: position.x + 350,
    y: position.y,
    wires: [[]] // Will connect to debug node
  };
};

/**
 * Create a debug node
 */
const createDebugNode = (reactNode, position, topic) => {
  return {
    id: generateNodeRedId(),
    type: "debug",
    z: "",
    name: `${topic}_debug`,
    active: true,
    tosidebar: true,
    console: false,
    tostatus: false,
    complete: "payload",
    targetType: "msg",
    statusVal: "",
    statusType: "auto",
    x: position.x + 700,
    y: position.y,
    wires: []
  };
};

/**
 * Export React Flow configuration to Node-RED format
 */
export const exportToNodeRed = (reactNodes, reactEdges) => {
  const flowTabId = generateNodeRedId();
  const flows = [];

  // Create flow tab
  flows.push({
    id: flowTabId,
    type: "tab",
    label: "React Flow Export",
    disabled: false,
    info: "",
    env: []
  });

  // Calculate initial Y position (spread nodes vertically)
  let yPosition = 40;
  const nodeSpacing = 100;

  // Convert each React Flow node to Node-RED nodes
  reactNodes.forEach((reactNode, index) => {
    const nodeConfig = Object.values(nodeRedConfig).find(
      config => config.displayLabel === reactNode.data.label
    );

    if (!nodeConfig) return;

    const modbusConfig = reactNode.data.modbusConfig || nodeConfig;

    // Create Modbus read node
    const modbusNode = convertToModbusReadNode(reactNode, {
      x: 180,
      y: yPosition
    });

    if (!modbusNode) return;

    modbusNode.z = flowTabId;

    // Create function node
    const functionNode = createFunctionNode(reactNode, {
      x: 180,
      y: yPosition
    }, modbusConfig);
    functionNode.z = flowTabId;

    // Create debug node
    const debugNode = createDebugNode(reactNode, {
      x: 180,
      y: yPosition
    }, modbusConfig.topic);
    debugNode.z = flowTabId;

    // Wire them together
    // Modbus -> Function (on success output, index 0)
    modbusNode.wires[0] = [functionNode.id];

    // Function -> Debug
    functionNode.wires[0] = [debugNode.id];

    flows.push(modbusNode, functionNode, debugNode);

    yPosition += nodeSpacing;
  });

  // Add Modbus server configurations
  Object.values(modbusServers).forEach(server => {
    flows.push({
      id: server.id,
      type: "modbus-client",
      name: server.name,
      clienttype: server.type,
      bufferCommands: true,
      stateLogEnabled: false,
      queueLogEnabled: false,
      failureLogEnabled: true,
      tcpHost: server.host || "127.0.0.1",
      tcpPort: server.port || 502,
      tcpType: "DEFAULT",
      serialPort: server.serialPort || "/dev/ttyUSB0",
      serialType: server.serialType || "RTU",
      serialBaudrate: server.baudrate || 9600,
      serialDatabits: server.databits || 8,
      serialStopbits: server.stopbits || 1,
      serialParity: server.parity || "none",
      serialConnectionDelay: 100,
      serialAsciiResponseStartDelimiter: "0x3A",
      unit_id: server.unitId || 1,
      commandDelay: 1,
      clientTimeout: server.timeout || 1000,
      reconnectOnTimeout: true,
      reconnectTimeout: server.reconnectTimeout || 2000,
      parallelUnitIdsAllowed: true,
      showErrors: false,
      showWarnings: true,
      showLogs: true
    });
  });

  return flows;
};

/**
 * Download the flows as a JSON file
 */
export const downloadNodeRedFlows = (flows, filename = 'flows.json') => {
  const jsonString = JSON.stringify(flows, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
