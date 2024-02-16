import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 임포트합니다.

function LabelOverlay({ onToggleFilterLabel, filterLabel }) {
  // const [filterLabel, setFilterLabel] = useState("Filtering");
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 초기화합니다.

  // 필터 레이블 토글 함수
  // const toggleFilterLabel = () => {
  //   setFilterLabel((currentLabel) => (currentLabel === "Filtering" ? "All" : "Filtering"));
  // };

  // 파일 업로드 함수
  const uploadFiles = async () => {
    const fileInput = fileInputRef.current;

    if (fileInput) {
      fileInput.setAttribute("multiple", true);
      fileInput.click();
    }
    };

  // 파일 선택 변경 이벤트 핸들러
  const handleChange = async (event) => {
    const fileInput = event.target;
    if (fileInput) {
      const selectedFiles = fileInput.files;
      if (selectedFiles.length > 0) {
        const formData = new FormData();

        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("files", selectedFiles[i]);
        }

        try {
          const response = await fetch(
            "http://localhost:8000/group/album/upload",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: formData,
            }
          );
          const responseData = await response.json();
          console.log(responseData);
          if (response.ok) {
            alert("파일 업로드 성공!");
            window.location.reload();
          } else {
            alert("파일 업로드 실패.");
          }
        } catch (error) {
          console.error("파일 업로드 중 오류 발생:", error);
        }
      }
    }
  };

  // 앨범 생성 페이지로 이동 함수
  const goToCreateAlbumPage = () => {
    navigate('/createalbum'); // '/createalbum' 경로로 이동합니다.
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        multiple
      />
      <button
        onClick={goToCreateAlbumPage} // 앨범 생성 버튼 클릭 이벤트
        style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        앨범 생성
      </button>
      <button
        onClick={uploadFiles} // 업로드 버튼 클릭 이벤트
        style={{ position: 'absolute', bottom: 43, right: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        업로드
      </button>
      <button
        onClick={onToggleFilterLabel} // 필터 토글 버튼 클릭 이벤트
        style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        {filterLabel}
      </button>
    </div>
  );
}

export default LabelOverlay;
