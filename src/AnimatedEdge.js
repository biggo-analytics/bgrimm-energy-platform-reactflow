import React from "react";
import { getBezierPath, MarkerType } from "reactflow";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) {
  // คำนวณ path ของเส้นเชื่อมแบบ Bezier curve
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* เส้นเชื่อมหลัก (สีเทา) */}
      <path
        id={id}
        style={{ stroke: "#ddd", strokeWidth: 3 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd || { type: MarkerType.ArrowClosed }}
      />
      {/* วงกลมที่จะเคลื่อนที่ */}
      <circle r="6" fill="#f81ce5">
        {/* ส่วนที่กำหนดการเคลื่อนไหว */}
        <animateMotion dur="4s" repeatCount="indefinite">
          {/* อ้างอิง path ที่จะให้วิ่งตาม โดยใช้ id ของเส้นเชื่อม */}
          <mpath xlinkHref={`#${id}`} />
        </animateMotion>
      </circle>
    </>
  );
}
