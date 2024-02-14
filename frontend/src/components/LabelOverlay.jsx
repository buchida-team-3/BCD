import React, { useState } from "react";

function LabelOverlay() {
  const [filterLabel, setFilterLabel] = useState("Filtering");

  const toggleFilterLabel = () => {
    setFilterLabel((currentLabel) => (currentLabel === "Filtering" ? "All" : "Filtering"));
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <button
        style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        앨범 생성
      </button>
      <button
        style={{ position: 'absolute', bottom: 43, right: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        업로드
      </button>
      <button
        onClick={toggleFilterLabel}
        style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        {filterLabel}
      </button>
    </div>
  );
}

export default LabelOverlay;
