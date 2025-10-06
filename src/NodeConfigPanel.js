import React, { useState, useEffect } from 'react';
import './NodeConfigPanel.css';

const NodeConfigPanel = ({ node, onClose, onSave }) => {
  const [config, setConfig] = useState({
    label: '',
    address: '',
    quantity: '',
    rate: '',
    scaleFactor: '',
    dataType: 'InputRegister',
    server: 'RTU',
    isSigned: true
  });

  useEffect(() => {
    if (node?.data?.modbusConfig) {
      const modbusConfig = node.data.modbusConfig;
      setConfig({
        label: node.data.label || '',
        address: modbusConfig.address || '',
        quantity: modbusConfig.quantity || '',
        rate: modbusConfig.rate || '',
        scaleFactor: modbusConfig.scaleFactor || '',
        dataType: modbusConfig.dataType || 'InputRegister',
        server: modbusConfig.server || 'RTU',
        isSigned: modbusConfig.isSigned !== undefined ? modbusConfig.isSigned : true
      });
    }
  }, [node]);

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedConfig = {
      ...config,
      address: parseInt(config.address),
      quantity: parseInt(config.quantity),
      rate: parseInt(config.rate),
      scaleFactor: parseFloat(config.scaleFactor)
    };

    onSave(updatedConfig);
  };

  if (!node) return null;

  return (
    <div className="node-config-overlay">
      <div className="node-config-panel">
        <div className="config-header">
          <h2>Configure Node: {node.data.label}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="config-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Label:</label>
              <input
                type="text"
                value={config.label}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>
          </div>

          <div className="config-section">
            <h3>Modbus Configuration</h3>

            <div className="form-group">
              <label>Data Type:</label>
              <select
                value={config.dataType}
                onChange={(e) => handleChange('dataType', e.target.value)}
              >
                <option value="InputRegister">Input Register</option>
                <option value="HoldingRegister">Holding Register</option>
                <option value="Coil">Coil</option>
                <option value="DiscreteInput">Discrete Input</option>
              </select>
            </div>

            <div className="form-group">
              <label>Address:</label>
              <input
                type="number"
                value={config.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g., 78"
              />
              <small>Modbus register address</small>
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={config.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="e.g., 10"
              />
              <small>Number of registers to read</small>
            </div>

            <div className="form-group">
              <label>Poll Rate (seconds):</label>
              <input
                type="number"
                value={config.rate}
                onChange={(e) => handleChange('rate', e.target.value)}
                placeholder="e.g., 3"
              />
              <small>How often to read the value</small>
            </div>

            <div className="form-group">
              <label>Server Type:</label>
              <select
                value={config.server}
                onChange={(e) => handleChange('server', e.target.value)}
              >
                <option value="RTU">RTU (Serial)</option>
                <option value="TCP">TCP (Network)</option>
              </select>
            </div>
          </div>

          <div className="config-section">
            <h3>Data Processing</h3>

            <div className="form-group">
              <label>Scale Factor:</label>
              <input
                type="number"
                step="0.1"
                value={config.scaleFactor}
                onChange={(e) => handleChange('scaleFactor', e.target.value)}
                placeholder="e.g., 0.1"
              />
              <small>Multiply raw value by this factor</small>
            </div>

            <div className="checkbox-group">
              <label>Signed 16-bit value:</label>
              <div>
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="isSigned"
                    checked={config.isSigned}
                    onChange={(e) => handleChange('isSigned', e.target.checked)}
                  />
                  <label htmlFor="isSigned" className="checkbox-label">
                    Enable signed value conversion
                  </label>
                </div>
                <small>Check if values can be negative</small>
              </div>
            </div>
          </div>

          <div className="config-info">
            <h4>Current Configuration Summary:</h4>
            <ul>
              <li><strong>Topic:</strong> <span>{node.data.modbusConfig?.topic}</span></li>
              <li><strong>Server ID:</strong> <span>{node.data.modbusConfig?.serverId}</span></li>
              <li><strong>Node-RED ID:</strong> <span>{node.data.nodeRedId}</span></li>
            </ul>
          </div>

          <div className="config-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
