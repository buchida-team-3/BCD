import React from 'react';
import './PhotoGrid.css';   // 스타일을 PhotoGrid.css 파일로 분리했다고 가정
import { album } from './album';

// 썸네일 사진들을 보여주는 PhotoGrid 컴포넌트
// http://localhost:3000/group/album
function PhotoGrid( images ) {
  return (
    <div className="photo-grid">
      <App images={images} />
    </div>
  );
}

export default PhotoGrid;
