import React, { useCallback, useRef, useState } from "react";
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
import { energyData, updateEnergyValue } from "./energyData";
import { updateNodesWithEnergyData } from "./initial-elements";
import { exportToNodeRed, downloadNodeRedFlows } from "./exportToNodeRed";

import ImageNode from "./ImageNode";
import AnimatedEdge from "./AnimatedEdge";
import Sidebar from "./Sidebar";
import NodeConfigPanel from "./NodeConfigPanel";

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
  const [selectedNode, setSelectedNode] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Energy data management hook
  const { updateSingleValue, updateValues, simulateApiUpdate, isUpdating } = useEnergyData(setNodes);

  // Handle node configuration click
  const handleConfigClick = useCallback((nodeId, data) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setShowConfigPanel(true);
    }
  }, [nodes]);

  // Add config click handler to nodes
  React.useEffect(() => {
    setNodes(nds => nds.map(node => ({
      ...node,
      data: {
        ...node.data,
        onConfigClick: handleConfigClick
      }
    })));
  }, [handleConfigClick, setNodes]);

  const handleSaveConfig = useCallback((updatedConfig) => {
    if (selectedNode) {
      // Update energyData
      const energyKey = selectedNode.id; // solar, battery, load, grid
      if (energyData[energyKey]) {
        energyData[energyKey].label = updatedConfig.label;
        energyData[energyKey].modbusConfig = {
          ...energyData[energyKey].modbusConfig,
          address: updatedConfig.address,
          quantity: updatedConfig.quantity,
          rate: updatedConfig.rate,
          scaleFactor: updatedConfig.scaleFactor,
          dataType: updatedConfig.dataType,
          server: updatedConfig.server,
          isSigned: updatedConfig.isSigned
        };
      }

      // Update nodes
      setNodes(updateNodesWithEnergyData());
      setShowConfigPanel(false);
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes]);

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

  const handleExportToNodeRed = useCallback(() => {
    const flows = exportToNodeRed(nodes, edges);
    downloadNodeRedFlows(flows, 'flows.json');
  }, [nodes, edges]);

  return (
    <div className="flow-container">
      <Sidebar />

      {/* Export Button */}
      <div style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000
      }}>
        <button
          onClick={handleExportToNodeRed}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
          }}
        >
          Export to Node-RED
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

      {/* Node Configuration Panel */}
      {showConfigPanel && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => {
            setShowConfigPanel(false);
            setSelectedNode(null);
          }}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
};

const FlowWithProvider = () => (
  <ReactFlowProvider>
    <OverviewFlow />
  </ReactFlowProvider>
);

export default FlowWithProvider;
