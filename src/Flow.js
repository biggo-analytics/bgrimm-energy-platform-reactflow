import React, { useCallback, useState, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  updateEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-elements";

import ImageNode from "./ImageNode";
import AnimatedEdge from "./AnimatedEdge";
import NodeModal from "./NodeModal";
import EdgeModal from "./EdgeModal";
import Sidebar from "./Sidebar";
import SettingsPanel from "./SettingsPanel";

const edgeTypes = {
  animated: AnimatedEdge,
};

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const nodeTypes = { imageNode: ImageNode };

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ id: null, label: "", imageUrl: "" });
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);
  const [edgeModalData, setEdgeModalData] = useState({ id: null, label: "" });
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);
  const onConnect = useCallback(
    (params) => {
      console.log("Connection attempt:", params);
      const newEdge = addEdge({ ...params, type: "animated" }, []);
      console.log("New edge created:", newEdge);
      setEdges((eds) => addEdge({ ...params, type: "animated" }, eds));
    },
    [setEdges]
  );

  // Custom nodes change handler to track selected node
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    
    // Find the selected node
    const selectedNodeChange = changes.find(change => 
      change.type === 'select' && change.selected === true
    );
    
    if (selectedNodeChange) {
      const selectedNodeData = nodes.find(node => node.id === selectedNodeChange.id);
      setSelectedNode(selectedNodeData);
    } else {
      // Check if any node is still selected
      const hasSelectedNode = nodes.some(node => node.selected);
      if (!hasSelectedNode) {
        setSelectedNode(null);
      }
    }
  }, [onNodesChange, nodes]);



  const onNodeDoubleClick = useCallback((event, node) => {
    setModalData({ id: node.id, label: node.data.label, imageUrl: node.data.imageUrl });
    setModalOpen(true);
  }, []);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    setEdgeModalData({ id: edge.id, label: edge.label || "" });
    setEdgeModalOpen(true);
  }, []);

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges((eds) =>
        eds.filter((e) => !deleted.some((n) => e.source === n.id || e.target === n.id))
      );
    },
    [setEdges]
  );

  const onEdgesDelete = useCallback(
    (deleted) => {
      setEdges((eds) => eds.filter((e) => !deleted.some((de) => de.id === e.id)));
    },
    [setEdges]
  );



  const handleSave = (data) => {
    if (data.id) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === data.id
            ? { ...n, data: { ...n.data, label: data.label, imageUrl: data.imageUrl } }
            : n
        )
      );
    } else {
      const id = `node_${+new Date()}`;
      setNodes((nds) =>
        nds.concat({
          id,
          type: "imageNode",
          position: { x: 0, y: 0 },
          data: { label: data.label, imageUrl: data.imageUrl, value: "" },
        })
      );
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setModalOpen(false);
  };

  const handleEdgeSave = (data) => {
    setEdges((eds) => eds.map((e) => (e.id === data.id ? { ...e, label: data.label } : e)));
    setEdgeModalOpen(false);
  };

  const handleEdgeDelete = (id) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
    setEdgeModalOpen(false);
  };

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
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

  // Handle node data updates from settings panel
  const handleNodeUpdate = useCallback((updatedData) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id
            ? { ...n, data: { ...n.data, ...updatedData } }
            : n
        )
      );
    }
  }, [selectedNode, setNodes]);

  return (
    <div className="flow-container">
      <Sidebar />
      <div 
        className="reactflow-wrapper" 
        ref={reactFlowWrapper}
        style={{ marginLeft: "250px", marginRight: "300px", height: "100vh" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onEdgeUpdate={onEdgeUpdate}
          onInit={onInitFlow}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          edgesUpdatable
          connectable={true}
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
        {/* SVG defs เดิม ไม่ต้องแก้ไข */}
        <svg>
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{ stopColor: "#ffc84d", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#ffab00", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
        </svg>

          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        <NodeModal
          isOpen={modalOpen}
          data={modalData}
          onChange={setModalData}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
        <EdgeModal
          isOpen={edgeModalOpen}
          data={edgeModalData}
          onChange={setEdgeModalData}
          onSave={handleEdgeSave}
          onDelete={handleEdgeDelete}
          onClose={() => setEdgeModalOpen(false)}
        />
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel 
        nodeData={selectedNode?.data} 
        onUpdateNode={handleNodeUpdate}
      />
    </div>
  );
};

const FlowWithProvider = () => (
  <ReactFlowProvider>
    <OverviewFlow />
  </ReactFlowProvider>
);

export default FlowWithProvider;
