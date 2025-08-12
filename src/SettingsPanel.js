import React, { useState, useEffect } from "react";
import "./SettingsPanel.css";

const SettingsPanel = ({ nodeData, onUpdateNode }) => {
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    imageUrl: ""
  });

  // Update form data when nodeData changes
  useEffect(() => {
    if (nodeData) {
      setFormData({
        label: nodeData.label || "",
        value: nodeData.value || "",
        imageUrl: nodeData.imageUrl || ""
      });
    }
  }, [nodeData]);

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Call the update callback with the new data
    if (onUpdateNode) {
      onUpdateNode(updatedData);
    }
  };

  if (!nodeData) {
    return (
      <div className="settings-panel">
        <div className="settings-header">
          <h3>Node Settings</h3>
        </div>
        <div className="settings-content">
          <p className="no-selection">Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Node Settings</h3>
        <div className="node-preview">
          <img 
            src={nodeData.imageUrl} 
            alt={nodeData.label} 
            className="node-preview-image"
          />
          <span className="node-preview-label">{nodeData.label}</span>
        </div>
      </div>
      
      <div className="settings-content">
        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input
            id="label"
            type="text"
            value={formData.label}
            onChange={(e) => handleInputChange("label", e.target.value)}
            placeholder="Enter node label"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Value</label>
          <input
            id="value"
            type="text"
            value={formData.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            placeholder="Enter node value"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            placeholder="Enter image URL"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Preview</label>
          <div className="node-preview-container">
            <div className="image-node-preview">
              {formData.imageUrl && (
                <img 
                  src={formData.imageUrl} 
                  alt={formData.label} 
                  className="node-image-preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              )}
              <div className="node-image-placeholder" style={{ display: formData.imageUrl ? 'none' : 'block' }}>
                No Image
              </div>
              <div className="node-label-preview">
                <strong>{formData.value || "0.00 kW"}</strong>
              </div>
              <div className="node-label-preview">{formData.label || "Node Label"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
