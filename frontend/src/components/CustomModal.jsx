// CustomModal.js
import React from "react";
import "./CustomModal.css"; // 모달에 대한 스타일을 정의한 CSS 파일

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default CustomModal;
