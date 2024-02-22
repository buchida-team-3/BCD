import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 임포트합니다.
import CreateAlbumModal from "./CreateAlbumModal";
import ReactDOM from 'react-dom';
import axios from "axios";

function LabelOverlay({ onToggleFilterLabel, filterLabel }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 초기화합니다.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const LoadingModal = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h2>처리 중...</h2>
          <progress className="progress-bar" max="100"></progress>
        </div>
      </div>
    );
  };

  // 모달창 열기 수정
  const openModal = () => {
    document.body.style.overflow = 'hidden';
    setIsModalOpen(true);
  };

  // 모달창 닫기 수정
  const closeModal = () => {
    document.body.style.overflow = 'auto';
    setIsModalOpen(false);
  };

 // 모달 외부 클릭 감지하여 닫기
 useEffect(() => {
  const handleClickOutside = (event) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isModalOpen]);

  // 파일 업로드 함수
  const uploadFiles = async () => {
    const fileInput = fileInputRef.current;

    if (fileInput) {
      fileInput.setAttribute("multiple", true);
      fileInput.click();
    }
  };

  // 파일 선택 변경 이벤트 핸들러
  // const handleChange = async (event) => {
  //   const fileInput = event.target;
  //   if (fileInput) {
  //     const selectedFiles = fileInput.files;
  //     if (selectedFiles.length > 0) {
  //       const formData = new FormData();

  //       for (let i = 0; i < selectedFiles.length; i++) {
  //         formData.append("files", selectedFiles[i]);
  //       }

  //       try {
  //         const response = await fetch(
  //           "http://localhost:8000/group/album/upload",
  //           {
  //             method: "POST",
  //             headers: {
  //               Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //             },
  //             body: formData,
  //           }
  //         );
  //         const responseData = await response.json();

  //         console.log("LabelOverlay.jsx -> responseData:", responseData);

  //         if (response.ok) {
  //           alert("파일 업로드 성공!");
  //           window.location.reload();
  //         } else {
  //           alert("파일 업로드 실패.");
  //         }
  //       } catch (error) {
  //         console.error("파일 업로드 중 오류 발생:", error);
  //       }
  //     }
  //   }
  // };
  const handleChange = async (event) => {
    const fileInput = event.target;
    if (fileInput) {
      const selectedFiles = fileInput.files;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        setIsLoading(true);
        
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("files", selectedFiles[i]);
        }
  
        try {
          const response = await axios.post(
            "http://localhost:8000/group/album/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                // 'Content-Type': 'multipart/form-data' 이 부분은 axios가 자동으로 설정함
              },
            }
          );
  
          console.log("LabelOverlay.jsx -> responseData:", response.data);
  
          setIsLoading(false); // 2초 후 로딩 종료
          if (response.status === 200) {
            alert("파일 업로드 성공!");
            window.location.reload();
          } else {
            alert("파일 업로드 실패.");
          }
        } catch (error) {
          console.error("파일 업로드 중 오류 발생:", error);
          setIsLoading(false); // 2초 후 로딩 종료
        }
      }
    }
  };

  // 앨범 생성 페이지로 이동 함수
  // const goToCreateAlbumPage = () => {
  //   openModal();
  //   // navigate("/createalbum"); // 기존의 페이지 이동 코드는 주석 처리
  // };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", width: "100%", height: "100%" }}>
      <LoadingModal isLoading={isLoading} />
      <input type="file" ref={fileInputRef} onChange={handleChange} style={{ display: "none" }} multiple />
      <button onClick={openModal} style={{ position: "absolute", bottom: 43, left: 80, fontSize: "20px", color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}>앨범 생성</button>
      <button onClick={uploadFiles} style={{ position: "absolute", bottom: 43, right: 80, fontSize: "20px", color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer"  }}>업로드</button>
      {/* <button onClick={uploadFiles} style={{ position: "absolute", bottom: 70, right: 80, fontSize: "20px", color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" , zIndex : '10' }}>업로드</button> */}
      {/* <button onClick={onToggleFilterLabel} style={{ position: "absolute", top: 40, left: 40, fontSize: "20px", color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}>{filterLabel === "All" ? "전체보기" : "정렬하기"}</button> */}
      {isModalOpen && ReactDOM.createPortal(
  <div ref={modalRef} onClick={(e) => e.stopPropagation()} style={{zIndex: 10000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <CreateAlbumModal onClose={closeModal} />
  </div>,
  document.body // 모달을 body 태그의 최상단에 렌더링합니다.
)}
    </div>
  );
}

export default LabelOverlay;
