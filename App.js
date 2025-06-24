import React, { useCallback, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle, Position
} from "reactflow";
import "reactflow/dist/style.css";
import "./styles.css";

const initialNodes = [];
const initialEdges = [];
const blockList = [
  { id: "1", type: "blockA", label: "Block A" },
  { id: "2", type: "blockB", label: "Block B" },
];

let id = 3;
const getId = () => `${id++}`;

const nodeTypes = {
  blockA: ({ data }) => (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        alert("Hello World");
      }}
      style={{
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#b9fbc0",
        border: "1px solid #333",
        position: "relative",
      }}
    >
      {data.label}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
    </div>
  ),
  
  blockB: ({ data }) => (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        alert("Hello World");
      }}
      style={{
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#ffe066",
        border: "1px solid #333",
        position: "relative",
      }}
    >
      {data.label}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
    </div>
  ),
  
};

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);

    if (sourceNode?.type === "blockA" && targetNode?.type === "blockB") {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    } else {
      alert("Only Block A can connect to Block B");
    }
  }, [nodes]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    const label = event.dataTransfer.getData("label");

    if (typeof type === "undefined" || !type) return;

    const position = { x: event.clientX - 250, y: event.clientY - 40 };
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="wrapper">
      <div className="sidebar">
        {blockList.map((block) => (
          <div
            key={block.id}
            className="dnd-node"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/reactflow", block.type);
              event.dataTransfer.setData("label", block.label);
            }}
            style={{
              backgroundColor: block.type === "blockA" ? "#b9fbc0" : "#ffe066",
            }}
          >
            {block.label}
          </div>
        ))}
      </div>

      <div className="canvas" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
