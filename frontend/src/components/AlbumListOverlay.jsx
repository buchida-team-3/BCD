import React from "react";

function AlbumListOverlay() {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
        <a
          href="/uploadpage"
          style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px', color: "white"}}>
          뒤로 가기
        </a>
        <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px', color: "white" }}>Album List</div>
        {/* <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>10/15/2021</div> */}
      </div>
    )
  }

export default AlbumListOverlay;