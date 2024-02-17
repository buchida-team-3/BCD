import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트합니다.
import './CreateAlbumPage.css'; // CSS 파일 임포트
import bgImage from './content/background.jpg';

function CreateAlbumPage() {
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const groups = ['Car', 'Inside', 'Animal', 'Vehicle', 'Person', 'Electronic', 'Dish', 'Food', 'Sport', 'Landscape', 'Accessory'];
  const navigate = useNavigate(); // useNavigate 훅으로 navigate 함수를 초기화합니다.

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('앨범 제목:', albumTitle);
    console.log('선택된 정렬 그룹:', selectedGroups);
    // 여기에 앨범 생성 로직을 추가하세요.
    // 폼 제출 후 /book 경로로 이동
    navigate('/book');
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
