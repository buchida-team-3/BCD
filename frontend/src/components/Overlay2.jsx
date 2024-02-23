import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Overlay2.css";

function Overlay2() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    return (
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
        {/* <a
          href="https://www.instagram.com/tilldeathwedoart2020/"
          target="_blank"
          style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px' }}>
        </a> */}
        {/* <button onClick={goBack} style={{ position: 'absolute', bottom: '43px', left: '80px', fontSize: '20px', color: "white", background: "none", border: "none", cursor: "pointer", pointerEvents: 'all' }}> */}
        <button className="back-button" onClick={goBack} >
        뒤로 가기
      </button>
      </div>
    )
  }

export default Overlay2;