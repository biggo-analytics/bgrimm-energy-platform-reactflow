import React, { memo } from "react";
import { Handle, Position } from "reactflow";

import "./ImageNode.css";

export default memo(({ data, isConnectable }) => {
  // Format energy value display
  const displayValue = data.energyValue !== undefined
    ? `${data.energyValue.toFixed(2)} ${data.energyUnit || 'kW'}`
    : data.value;

  return (
    <>
      {/* Handle สำหรับรับเส้นเชื่อมเข้ามา */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="image-node">
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.label} className="node-image" />
        )}
        <div className="node-label">
          <strong>{displayValue}</strong>
        </div>
        <div className="node-label">{data.label}</div>
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
