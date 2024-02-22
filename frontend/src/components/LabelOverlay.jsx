import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import CreateAlbumModal from "./CreateAlbumModal";
import { useImageData } from "./ImageContext";

function LabelOverlay({ onToggleFilterLabel, filterLabel }) {
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const { setImageData } = useImageData();
  const [isLoading, setIsLoading] = useState(false);
  
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const openModal = () => {
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setIsModalOpen(false);
  };

  const uploadFiles = async () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.setAttribute("multiple", true);
      fileInput.click();
    }
  };

  // 이미지 데이터를 새로고침하는 함수
  const refreshImages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.status === 200) {
        setImageData(response.data);
      } else {
        console.error("이미지 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("이미지 목록을 불러오는 중 오류 발생:", error);
    }
  };

  const handleChange = async (event) => {
    const fileInput = event.target;
    if (fileInput && fileInput.files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("files", fileInput.files[i]);
      }
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/group/album/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setIsLoading(false);

        if (response.status === 200) {
          alert("파일 업로드 성공!");
          window.location.reload();
          // 파일 업로드 성공 후 이미지 목록 새로고침
          await refreshImages();
          window.location.reload();
        } else {
          alert("파일 업로드 실패.");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("파일 업로드 중 오류 발생:", error);
      }
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", width: "100%", height: "100%" }}>
      <LoadingModal isLoading={isLoading} />
      <input type="file" ref={fileInputRef} onChange={handleChange} style={{ display: "none" }} multiple />
      <button onClick={openModal} style={{ position: "absolute", bottom: 43, left: 80, fontSize: "20px", color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}>앨범 생성</button>
      <button onClick={uploadFiles} style={{ position: "absolute", bottom: 43, right: 80, fontSize: "20px", color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}>업로드</button>
      {isModalOpen && ReactDOM.createPortal(
        <div ref={modalRef} onClick={(e) => e.stopPropagation()} style={{ zIndex: 10000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CreateAlbumModal onClose={closeModal} />
        </div>,
        document.body
      )}
    </div>
  );
}

export default LabelOverlay;
