import React, { useState, useRef, useEffect } from "react";
import { useAlbumList } from './AlbumListContext';
import CreateAlbumModal from "./CreateAlbumModal";
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

export function AlbumListOverlay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const { hoveredCard } = useAlbumList();
  // 뒤로 가기 함수
  const goBack = () => {
      navigate(-1);
  };

  // 모달창 열기 수정
  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setIsModalOpen(true);
  };

  // 모달창 닫기 수정
  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setIsModalOpen(false);
  };

 // 모달 외부 클릭 감지하여 닫기
 useEffect(() => {
  const handleClickOutside = (event) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isModalOpen]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      {hoveredCard && (
        <>
          <div style={{ position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '50px', color: "white" }}>
            여기에 원하는 텍스트
          </div>
          <button onClick={goBack} style={{ position: 'absolute', bottom: '43px', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', color: "white", background: "none", border: "none", cursor: "pointer", pointerEvents: 'all' }}>
            수정하기
          </button>
        </>
      )}
      {/* <button onClick={goBack} style={{ position: 'absolute', bottom: '43px', left: '80px', fontSize: '20px', color: "white", background: "none", border: "none", cursor: "pointer", pointerEvents: 'all' }}>
        뒤로 가기
      </button> */}
      <button onClick={openModal} style={{ position: 'absolute', bottom: '43px', right: '80px', fontSize: '20px', color: "white", background: "none", border: "none", cursor: "pointer", pointerEvents: 'all' }}>
        앨범 생성
      </button>
      {isModalOpen && ReactDOM.createPortal(
  <div ref={modalRef} onClick={(e) => e.stopPropagation()} style={{zIndex: 10000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <CreateAlbumModal onClose={closeModal} />
  </div>,
  document.body // 모달을 body 태그의 최상단에 렌더링합니다.
)}
      <div style={{ position: 'absolute', top: '100px', left: '40px', fontSize: '20px', color: "white" }}>앨범 목록</div>
    </div>
  )
}

export default AlbumListOverlay;
