import React, { memo } from "react";
import { Handle, Position } from "reactflow";

import "./ImageNode.css";

// ใช้ memo เพื่อป้องกันการ re-render ที่ไม่จำเป็น
export default memo(({ data, isConnectable }) => {
  return (
    <>
      {/* Handle สำหรับรับเส้นเชื่อมเข้ามา */}
      <Handle
        id="target"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="image-node">
        {data.imageUrl && (
          <img src={data.imageUrl} alt={data.label} className="node-image" />
        )}
        <div className="node-label">
          <strong>{data.value}</strong>
        </div>
        <div className="node-label">{data.label}</div>
      </div>

      {/* Handle สำหรับลากเส้นเชื่อมออกไป */}
      <Handle
        id="source"
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
});
