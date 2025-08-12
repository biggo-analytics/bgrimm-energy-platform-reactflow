import React from "react";
import "./Sidebar.css";

const nodeTypes = [
  {
    type: "solar",
    label: "Solar",
    icon: "https://cdn-icons-png.flaticon.com/512/3463/3463440.png",
    value: "12.02 kW",
  },
  {
    type: "battery",
    label: "Battery",
    icon: "https://cdn-icons-png.flaticon.com/512/1687/1687413.png",
    value: "55.34 kW",
  },
  {
    type: "load",
    label: "Load",
    icon: "https://cdn-icons-png.flaticon.com/512/2801/2801682.png",
    value: "23.02 kW",
  },
  {
    type: "grid",
    label: "Grid",
    icon: "https://cdn-icons-png.flaticon.com/512/4882/4882999.png",
    value: "16.12 kW",
  },
];

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Components</h3>
      </div>
      <div className="sidebar-content">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className="sidebar-item"
            draggable
            onDragStart={(event) => onDragStart(event, nodeType)}
          >
            <div className="sidebar-item-icon">
              <img src={nodeType.icon} alt={nodeType.label} />
            </div>
            <div className="sidebar-item-content">
              <div className="sidebar-item-label">{nodeType.label}</div>
              <div className="sidebar-item-value">{nodeType.value}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
