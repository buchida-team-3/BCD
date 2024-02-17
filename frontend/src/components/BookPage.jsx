import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // axios 임포트
import HTMLFlipBook from "react-pageflip";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import "./BookPage.css";
import PageCover from "./PageCover";
import Page from "./Page";
import EditModal from "./EditModal";

function BookPage(props) {
  const [albumData, setAlbumData] = useState({ albumTitle: "", photos: [] }); // 앨범 데이터 상태 추가
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTexts, setEditTexts] = useState({});
  const flipBook = useRef(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 서버로부터 앨범 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        // localStorage에서 album_title을 가져옵니다.
        const albumTitle = localStorage.getItem('album_title');
        // album_title을 쿼리 파라미터로 추가하여 서버로 요청을 보냅니다.
        // const response = await axios.get(`http://localhost:8000/api/album/data?album_title=${albumTitle}`);
        const response = await axios.get(`http://localhost:8000/api/album/data?album_title=${encodeURIComponent(albumTitle)}`);
        setAlbumData(response.data); // 서버로부터 받은 데이터를 상태에 저장
      } catch (error) {
        console.error('Failed to fetch album data:', error);
        alert('Failed to fetch album data:', error);
      }
    };
  
    fetchAlbumData();
  }, []);

  useEffect(() => {
    const pageCount = flipBook.current?.pageFlip()?.getPageCount();
    if (pageCount) {
      setPage(pageCount);
    }
  }, [albumData]); // albumData 의존성 추가

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  const saveTexts = async (leftText, rightText) => {
    // 변경된 텍스트를 서버로 전송하는 로직
    const payload = {
      page: page,
      leftText: leftText,
      rightText: rightText,
    };
  
    try {
      // 여기에 실제 업데이트를 위한 API 엔드포인트와 HTTP 메서드를 교체하세요.
      // 이 예제에서는 PATCH 메서드를 사용하고, 페이지 번호와 텍스트를 전송합니다.
      await axios.patch('여기에 실제 페이지 텍스트 업데이트 API URL 입력', payload);
      alert('텍스트 업데이트 성공');
  
      // 성공적으로 서버에 데이터를 업데이트한 후, 프론트엔드 상태도 업데이트
      setEditTexts({ ...editTexts, [page]: leftText, [page + 1]: rightText });
    } catch (error) {
      console.error('텍스트 업데이트 실패:', error);
      alert('텍스트 업데이트 실패');
    }
  
    setIsModalOpen(false);
  };

  // "Edit Image" 버튼 클릭 시 /edit 경로로 이동하는 함수
  const navigateToEdit = () => {
    navigate('/edit');
  };

  // 앨범 리스트로 돌아가기
  const goBackToAlbumList = () => {
    navigate('/albumlist');
  };

  return (
    <div>
      <button className="book-button" onClick={openEditModal}>글 수정</button>
      <button className="book-button" onClick={navigateToEdit}>이미지 수정</button>
      <button className="book-button" onClick={goBackToAlbumList} style={{float: 'right'}}>앨범 목록</button>
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
        onFlip={(e) => setPage(e.data)}
        className="demo-book"
        ref={flipBook}
      >
        <PageCover>{albumData.albumTitle || "Loading Album..."}</PageCover>
        {albumData.photos.map((photo, index) => (
          <Page
            key={index}
            number={index + 1}
            text={editTexts[index + 1] || photo.text}
            imageUrl={photo.imageUrl}
            timestamp={photo.timestamp}
          />
        ))}
        <PageCover>THE END</PageCover>
      </HTMLFlipBook>

      <EditModal
        isOpen={isModalOpen}
        leftPageText={editTexts[page] || ""}
        rightPageText={editTexts[page + 1] || ""}
        onSave={saveTexts}
        onCancel={() => setIsModalOpen(false)}
        currentPage={page}
      />
    </div>
  );
}

export default BookPage;
