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

              {/* Flow gradient for animated short lines */}
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
                <stop offset="25%" stopColor="#ffffff" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
                <stop offset="75%" stopColor="#ffffff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
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
