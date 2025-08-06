import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  updateEdge,
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
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "animated" }, eds)),
    [setEdges]
  );

  const openAddModal = () => {
    setModalData({ id: null, label: "", imageUrl: "" });
    setModalOpen(true);
  };

  const onNodeDoubleClick = useCallback((event, node) => {
    setModalData({ id: node.id, label: node.data.label, imageUrl: node.data.imageUrl });
    setModalOpen(true);
  }, []);

  const onEdgeDoubleClick = useCallback((event, edge) => {
    setEdgeModalData({ id: edge.id, label: edge.label || "" });
    setEdgeModalOpen(true);
  }, []);

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

  return (
    <>
      <button
        style={{ position: "absolute", zIndex: 4, right: 10, top: 10 }}
        onClick={openAddModal}
      >
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeUpdate={onEdgeUpdate}
        onInit={onInit}
        fitView
        edgesUpdatable
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
        // 3. ส่ง edgeTypes เป็น prop
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
    </>
  );
};

export default OverviewFlow;
