import React from "react";
import { useAlbumList } from './AlbumListContext';

function AlbumListOverlay() {
  const { hoveredCard } = useAlbumList();
  // 뒤로 가기 함수
  const goBack = () => {
      window.history.back();
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      {hoveredCard && (
        <>
          <div style={{ position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', color: "white" }}>
            여기에 원하는 텍스트
          </div>
          <button onClick={goBack} style={{ position: 'absolute', bottom: '43px', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', color: "white", background: "none", border: "none", cursor: "pointer", pointerEvents: 'all' }}>
            수정하기
          </button>
        </>
      )}
      <button onClick={goBack} style={{ position: 'absolute', bottom: '43px', left: '80px', fontSize: '20px', color: "white", background: "none", border: "none", cursor: "pointer", pointerEvents: 'all' }}>
        뒤로 가기
      </button>
      <div style={{ position: 'absolute', top: '100px', left: '40px', fontSize: '20px', color: "white" }}>앨범 목록</div>
    </div>
  )
}

export default AlbumListOverlay;
