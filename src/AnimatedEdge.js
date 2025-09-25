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

  // Get dot color from data, default to white
  const dotColor = data?.dotColor || '#ffffff';

  return (
    <g>
      {/* Main solid gradient edge path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        fill="none"
      />

      {/* Animated dot that flows along the path */}
      <circle r="4" fill={dotColor} stroke="#000" strokeWidth="0.5">
        <animateMotion dur="5s" repeatCount="indefinite">
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
    </g>
  );
}
