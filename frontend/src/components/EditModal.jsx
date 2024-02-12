import React, { useState } from 'react';

function EditModal({ isOpen, leftPageText, rightPageText, onSave, onCancel, currentPage }) {
  const [leftText, setLeftText] = useState(leftPageText);
  const [rightText, setRightText] = useState(rightPageText);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(leftText, rightText);
    setLeftText(""); // 저장 후 입력란 비우기
    setRightText(""); // 저장 후 입력란 비우기
  };

  return (
    <div className="modal">
      <textarea value={leftText} onChange={(e) => setLeftText(e.target.value)} />
      <textarea value={rightText} onChange={(e) => setRightText(e.target.value)} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default EditModal;
