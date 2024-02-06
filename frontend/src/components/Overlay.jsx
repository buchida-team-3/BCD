import React from "react";

function Overlay() {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
        <a
          href="https://www.instagram.com/tilldeathwedoart2020/"
          target="_blank"
          style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px' }}>
          Follow me
        </a>
        <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px' }}>Ria Chakravarty</div>
        {/* <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>10/15/2021</div> */}
      </div>
    )
  }

export default Overlay;