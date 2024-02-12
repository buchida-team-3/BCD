import React, { useState } from 'react';

function EditModal({ isOpen, leftPageText, rightPageText, onSave, onCancel }) {
  const [leftText, setLeftText] = useState(leftPageText);
  const [rightText, setRightText] = useState(rightPageText);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <textarea value={leftText} onChange={(e) => setLeftText(e.target.value)} />
      <textarea value={rightText} onChange={(e) => setRightText(e.target.value)} />
      <button onClick={() => onSave(leftText, rightText)}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default EditModal;