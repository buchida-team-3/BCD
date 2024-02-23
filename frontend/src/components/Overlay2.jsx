import React from "react";
import { useNavigate } from 'react-router-dom';
import "./EditButton2.css"
import ReactDOM from "react-dom"; // ReactDOM을 임포트합니다.

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
          Follow me
        </a> */}
        <button className="edit-button2" onClick={goBack} style={{ pointerEvents: 'auto' }}>
        뒤로 가기
      </button>
        {/* <div style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px' }}>Ria Chakravarty</div> */}
        {/* <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>10/15/2021</div> */}
      </div>
    )
  }

export default Overlay2;