import React from "react";

function AlbumListOverlay() {
  // 뒤로 가기 함수
  const goBack = () => {
      window.history.back();
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <a
        href="#"
        onClick={goBack}
        style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px', color: "white"}}>
        뒤로 가기
      </a>
      <div style={{ position: 'absolute', top: 100, left: 40, fontSize: '20px', color: "white" }}>앨범 목록</div>
    </div>
  )
}


export default AlbumListOverlay;