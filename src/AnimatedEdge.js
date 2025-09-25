import React from "react";
import { getSmoothStepPath } from "reactflow";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
}) {
  // Calculate the edge path
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      {/* Base path - solid muted single color */}
      <path
        id={`${id}-base`}
        style={{
          stroke: "#d1d5db",
          strokeWidth: (style?.strokeWidth || 4) + 2,
          strokeOpacity: 0.6
        }}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
      />

      {/* Animated gradient flow - shorter lines */}
      <path
        d={edgePath}
        fill="none"
        stroke="url(#flow-gradient)"
        strokeWidth={style?.strokeWidth || 4}
        strokeDasharray="12 88"
        strokeLinecap="round"
        opacity="0.9"
        markerEnd={markerEnd}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="100;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

    </g>
  );
}
