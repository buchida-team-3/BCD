import React, { useState, useRef } from "react";

function LabelOverlay() {
  const [filterLabel, setFilterLabel] = useState("Filtering");
  const fileInputRef = useRef(null);

  const toggleFilterLabel = () => {
    setFilterLabel((currentLabel) => (currentLabel === "Filtering" ? "All" : "Filtering"));
  };

  const uploadFiles = async () => {
    const fileInput = fileInputRef.current;

    if (fileInput) {
      fileInput.setAttribute("multiple", true);
      fileInput.click();
    }
  };

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
          console.log(await response.json());
          if (response.ok) {
            alert("파일 업로드 성공!");
          } else {
            alert("파일 업로드 실패.");
          }
        } catch (error) {
          console.error("파일 업로드 중 오류 발생:", error);
        }
      }
    }
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
        style={{ position: 'absolute', bottom: 43, left: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        앨범 생성
      </button>
      <button
        onClick={uploadFiles}
        style={{ position: 'absolute', bottom: 43, right: 80, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        업로드
      </button>
      <button
        onClick={toggleFilterLabel}
        style={{ position: 'absolute', top: 40, left: 40, fontSize: '20px', color: "white", backgroundColor: "transparent", border: "none", pointerEvents: "auto", cursor: "pointer" }}
      >
        {filterLabel}
      </button>
    </div>
  );
}

export default LabelOverlay;
