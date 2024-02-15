import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import "./DemoBook.css";
import axios from 'axios';
import PageCover from './PageCover';

// Page 컴포넌트 정의
const Page = React.forwardRef(({ number, text, imageUrl }, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <h2 className="page-header">Page {number}</h2>
        <img src={imageUrl} alt={`Page ${number}`} style={{ width: '100%', height: 'auto' }} />
        <div className="page-text">{text}</div>
        <div className="page-footer">{number}</div>
      </div>
    </div>
  );
});

// DemoBook 컴포넌트 정의
function DemoBook() {
  const [pages, setPages] = useState([]);
  const flipBook = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/album', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Label': 'img_label_0'
          }
        });
        // 받아온 이미지 URL을 페이지 배열로 설정
        const newPages = response.data.map((url, index) => ({
          number: index + 1,
          text: `Page ${index + 1} Default Text`,
          imageUrl: url
        }));
        setPages(newPages);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        navigate('/loginandsignup');
      }
    };

    fetchImages();
  }, [navigate]);

  // 앨범 리스트로 돌아가기
  const goBackToAlbumList = () => {
    navigate('/albumlist');
  };

  return (
    <div>
      {/* Edit Text 버튼 추가, 기능은 구현하지 않음 */}
      <button onClick={() => alert('Edit text feature is not implemented yet.')}>Edit Text</button>
      <button onClick={goBackToAlbumList} style={{float: 'right'}}>BACK</button>
      <HTMLFlipBook
        width={620}
        height={580}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="demo-book"
        ref={flipBook}
      >
        <PageCover>추억 앨범</PageCover>
        {pages.map((page, index) => (
          
          <Page
            key={index}
            number={page.number}
            text={page.text}
            imageUrl={page.imageUrl}
          />
        ))}
      </HTMLFlipBook>
    </div>
  );
}

export default DemoBook;
