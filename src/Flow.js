import React, { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-elements";
import { useEnergyData } from "./useEnergyData";

import ImageNode from "./ImageNode";
import AnimatedEdge from "./AnimatedEdge";
import Sidebar from "./Sidebar";

const edgeTypes = {
  animated: AnimatedEdge,
};

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const nodeTypes = { imageNode: ImageNode };

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  // Energy data management hook
  const { updateSingleValue, updateValues, simulateApiUpdate, isUpdating } = useEnergyData(setNodes);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");

      if (typeof data === "undefined" || !data) {
        return;
      }

      const nodeData = JSON.parse(data);
      const position = reactFlowInstance.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${nodeData.type}-${Date.now()}`,
        type: "imageNode",
        position,
        data: {
          label: nodeData.label,
          value: nodeData.value,
          imageUrl: nodeData.icon,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onInitFlow = useCallback((instance) => {
    reactFlowInstance.current = instance;
    onInit(instance);
  }, []);

  return (
    <div className="flow-container">
      <Sidebar />

      {/* Energy Update Controls - for testing/demo */}
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <button
          onClick={simulateApiUpdate}
          disabled={isUpdating}
          style={{
            padding: "8px 16px",
            backgroundColor: isUpdating ? "#ccc" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isUpdating ? "not-allowed" : "pointer"
          }}
        >
          {isUpdating ? "Updating..." : "Simulate API Update"}
        </button>
      </div>

      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
        style={{ marginLeft: "250px", height: "100vh" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInitFlow}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          {/* SVG gradient definitions for edges */}
          <svg>
            <defs>
              {/* Green to Blue gradient */}
              <linearGradient id="gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
              </linearGradient>

              {/* Orange to Yellow gradient */}
              <linearGradient id="gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                <stop offset="100%" stopColor="#eab308" stopOpacity={1} />
              </linearGradient>

              {/* Purple to Pink gradient */}
              <linearGradient id="gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
              </linearGradient>

              {/* Teal to Cyan gradient */}
              <linearGradient id="gradient-4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={1} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
              </linearGradient>

              {/* Flow gradients for each edge with glow effects */}

              {/* Solar flow - bright orange glow */}
              <linearGradient id="flow-solar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0} />
                <stop offset="30%" stopColor="#fb923c" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
                <stop offset="70%" stopColor="#fb923c" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>

              {/* Battery flow - solid purple throughout */}
              <linearGradient id="flow-battery" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.7} />
                <stop offset="25%" stopColor="#a78bfa" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#c4b5fd" stopOpacity={1} />
                <stop offset="75%" stopColor="#a78bfa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
              </linearGradient>

              {/* Grid flow - gray glow */}
              <linearGradient id="flow-grid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0} />
                <stop offset="25%" stopColor="#9ca3af" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
                <stop offset="75%" stopColor="#9ca3af" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#6b7280" stopOpacity={0} />
              </linearGradient>

              {/* Glow filters for each edge */}
              <filter id="glow-solar" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="glow-battery" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="glow-grid" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>

          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

const FlowWithProvider = () => (
  <ReactFlowProvider>
    <OverviewFlow />
  </ReactFlowProvider>
);

export default FlowWithProvider;
