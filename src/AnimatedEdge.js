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
  data,
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

  // Get flow properties from data with defaults
  const flowGradient = data?.flowGradient || 'flow-solar';
  const glowFilter = data?.glowFilter || 'glow-solar';
  const dashArray = data?.dashArray || '12 88';
  const duration = data?.duration || '2s';

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

      {/* Animated gradient flow with unique glow for each edge */}
      <path
        d={edgePath}
        fill="none"
        stroke={`url(#${flowGradient})`}
        strokeWidth={style?.strokeWidth || 4}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        opacity="0.95"
        filter={`url(#${glowFilter})`}
        markerEnd={markerEnd}
      >
        <animate
          attributeName="stroke-dashoffset"
          values="100;0"
          dur={duration}
          repeatCount="indefinite"
        />
      </path>

    </g>
  );
}
