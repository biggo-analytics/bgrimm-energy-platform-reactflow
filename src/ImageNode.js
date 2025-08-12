import React, { memo } from "react";
import { Handle, Position } from "reactflow";

import "./ImageNode.css";

// ใช้ memo เพื่อป้องกันการ re-render ที่ไม่จำเป็น
export default memo(({ data, isConnectable }) => {
  return (
    <>
      {/* Handle สำหรับรับเส้นเชื่อมเข้ามา (ด้านซ้าย) */}
      <Handle
        id="target"
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          background: '#007bff',
          border: '2px solid #fff',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          cursor: 'crosshair',
        }}
      />

      <div className="image-node">
        <div className="node-content">
          <div className="node-icon">
            {data.imageUrl && (
              <img src={data.imageUrl} alt={data.label} className="node-image" />
            )}
          </div>
          <div className="node-text">
            <div className="node-value">
              <strong>{data.value}</strong>
            </div>
            <div className="node-label">{data.label}</div>
          </div>
        </div>
      </div>

      {/* Handle สำหรับลากเส้นเชื่อมออกไป (ด้านขวา) */}
      <Handle
        id="source"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          background: '#007bff',
          border: '2px solid #fff',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          cursor: 'crosshair',
        }}
      />
    </>
  );
});
