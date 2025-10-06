import React, { memo } from "react";
import { Handle, Position } from "reactflow";

import "./ImageNode.css";

export default memo(({ data, isConnectable, id }) => {
  // Format energy value display
  const displayValue = data.energyValue !== undefined
    ? `${data.energyValue.toFixed(2)} ${data.energyUnit || 'kW'}`
    : data.value;

  const handleDoubleClick = () => {
    if (data.onConfigClick) {
      data.onConfigClick(id, data);
    }
  };

  return (
    <>
      {/* Handle สำหรับรับเส้นเชื่อมเข้ามา */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="image-node" onDoubleClick={handleDoubleClick} title="Double-click to configure">
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.label} className="node-image" />
        )}
        <div className="node-label">
          <strong>{displayValue}</strong>
        </div>
        <div className="node-label">{data.label}</div>

        {/* Show Modbus config indicator */}
        {data.modbusConfig && (
          <div className="modbus-indicator" title={`Modbus: ${data.modbusConfig.topic}`}>
            <span className="config-badge">
              {data.modbusConfig.server} @ {data.modbusConfig.address}
            </span>
          </div>
        )}
      </div>

      {/* Handle สำหรับลากเส้นเชื่อมออกไป */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
});
