import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 임포트
import './CreateAlbumPage.css';
import bgImage from './content/background.jpg';

function CreateAlbumPage() {
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const groups = ['Car', 'Inside', 'Animal', 'Vehicle', 'Person', 'Electronic', 'Dish', 'Food', 'Sport', 'Landscape', 'Accessory'];
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setAlbumTitle(e.target.value);
  };

  const handleGroupChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedGroups([...selectedGroups, value]);
    } else {
      setSelectedGroups(selectedGroups.filter(group => group !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const albumData = {
      album_title: albumTitle, // Pydantic 모델에 정의된 필드명과 일치해야 함
      album_filter: selectedGroups // 서버에서 이 필드를 처리할 수 있도록 정의되어 있다면 포함
    };
  
    try {
      // axios를 사용하여 서버에 POST 요청을 보냅니다. 헤더에 인증 토큰을 포함시킵니다.
      const response = await axios.post('http://localhost:8000/api/album/create', { album_create: albumData }, { // 서버가 요구하는 형식에 맞게 데이터를 감싸서 보냄
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` // 인증 토큰 포함
        }
      });
      console.log('서버 응답:', response.data);
      navigate('/book');
    } catch (error) {
      console.error('앨범 생성 실패:', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="albumCreator-container">
        <img src={bgImage} alt="background" className="background-image" />
        <form onSubmit={handleSubmit} className="albumCreator-form">
          <div className="albumCreator-inputGroup">
            <label htmlFor="albumTitle" className="albumCreator-label">앨범 제목:</label>
            <input
              type="text"
              id="albumTitle"
              className="albumCreator-input"
              value={albumTitle}
              onChange={handleTitleChange}
            />
          </div>
          <div className="albumCreator-checkboxGroup">
            <label className="albumCreator-label">정렬 그룹 선택:</label>
            {groups.map(group => (
              <div key={group} className="albumCreator-checkboxWrapper">
                <input
                  type="checkbox"
                  id={group}
                  className="albumCreator-checkbox"
                  value={group}
                  checked={selectedGroups.includes(group)}
                  onChange={handleGroupChange}
                />
                <label htmlFor={group} className="albumCreator-checkboxLabel">{group}</label>
              </div>
            ))}
          </div>
          <button type="submit" className="albumCreator-submitBtn">앨범 생성</button>
        </form>
    </div>
  );
}

export default CreateAlbumPage;
