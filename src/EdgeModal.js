import React from "react";
import "./NodeModal.css";

const EdgeModal = ({ isOpen, data, onChange, onSave, onDelete, onClose }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Edge</h3>
        <label>
          Label
          <input name="label" value={data.label} onChange={handleChange} />
        </label>
        <div className="modal-actions">
          <button onClick={() => onSave(data)}>Save</button>
          <button onClick={() => onDelete(data.id)}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EdgeModal;
