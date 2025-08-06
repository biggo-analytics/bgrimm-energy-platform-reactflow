import React from "react";
import "./NodeModal.css";

const NodeModal = ({ isOpen, data, onChange, onSave, onDelete, onClose }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{data.id ? "Edit Node" : "Add Node"}</h3>
        <label>
          Name
          <input name="label" value={data.label} onChange={handleChange} />
        </label>
        <label>
          Icon URL
          <input name="imageUrl" value={data.imageUrl} onChange={handleChange} />
        </label>
        <div className="modal-actions">
          <button onClick={() => onSave(data)}>Save</button>
          {data.id && <button onClick={() => onDelete(data.id)}>Delete</button>}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;

