import React, { useEffect } from "react";

function AlbumListOverlay() {
  useEffect(() => {
    // 외부 라이브러리 초기화 또는 이벤트 리스너 추가 로직

    return () => {
      // Cleanup: 여기서 이벤트 리스너 제거
    };
  }, []);

  // 뒤로 가기 함수
  const goBack = () => {
    window.history.back();
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <button
        onClick={goBack}
        style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", cursor: "pointer" }}>
        뒤로 가기
      </button>
      <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px', color: "white" }}>Album List</div>
    </div>
  );
}

export default AlbumListOverlay;
