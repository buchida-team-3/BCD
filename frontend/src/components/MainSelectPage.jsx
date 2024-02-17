import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import './MainSelectPage.css'; // CSS 파일 경로 확인
import bgImage from './content/background.jpg';
import Navbar from './Navbar';

function MainSelectPage() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  // "Album Create" 버튼 클릭 핸들러
  const handleAlbumCreateClick = () => {
    navigate('/labelpage'); // /labelpage 경로로 이동
  };

  // "Album List" 버튼 클릭 핸들러
  const handleAlbumListClick = () => {
    navigate('/albumlist'); // /albumlist 경로로 이동
  };

  return (
    <div>
      <Navbar />
      <div className="select-container">
      <div className="select-button-group">
        <img src={bgImage} alt="background" className="background-image" />
        <button className="select-button" onClick={handleAlbumCreateClick}>
          Album Create
        </button>
        <button className="select-button" onClick={handleAlbumListClick}>
          Album list
        </button>
      </div>
    </div>
    </div>
    
  );
}

export default MainSelectPage;
