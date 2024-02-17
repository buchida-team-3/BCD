import { React, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import './MainSelectPage.css'; // CSS 파일 경로 확인
import bgImage from './content/background.jpg';
import { useImageData } from './ImageContext';
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

  // 여기에서 모든 이미지 미리 로드하기
  const { imageData, setImageData } = useImageData();
  useEffect(() => {
    const fetchImages = async () => {
      // 모든 이미지 미리 비동기로 로딩하기
      const endpoint = '/api/all'
      try {
        const response = await axios.get(`http://localhost:8000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Label': '/api/all'
          }
        });

        console.log('/mainselect 이미지 데이터 로드:', response.data);
        
        // 이미지 데이터의 전역 상태 관리
        setImageData(response.data);

      } catch (error) {
        console.error('이미지 데이터 로드 중 오류 발생:', error);
      }
    };

    if (imageData.length === 0) {
      fetchImages();
    }
    // fetchImages();
  }, [ imageData, setImageData ]);


  return (
    <div>
      <Navbar />
      <div className="select-container">
      <div className="select-button-group">
        <img src={bgImage} alt="background" className="background-image" />
        <button className="select-button" onClick={handleAlbumCreateClick}>
          앨범 생성
        </button>
        <button className="select-button" onClick={handleAlbumListClick}>
          앨범 리스트
        </button>
      </div>
    </div>
    </div>
    
  );
}

export default MainSelectPage;
