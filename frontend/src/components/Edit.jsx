import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Edit.css";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import editDefault from "./content/edit_default.jpg";
import bgImage from "./content/background.jpg";
import { useImageData } from "./ImageContext";

const Edit = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkedImages, setCheckedImages] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [overlayImages, setOverlayImages] = useState([]); // 겹쳐진 이미지들의 정보 배열

  const [dragging, setDragging] = useState(false); // 드래그 중인지 여부
  const [draggingIndex, setDraggingIndex] = useState(null); // 현재 드래그 중인 이미지 인덱스

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const overlayContainerRef = useRef(null); // 선택된 이미지를 담고 있는 컨테이너의 ref

  const { imageData, setImageData } = useImageData();

  const getQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    // const selectedImageForEditPath = "https://jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com/img_01/";
    return {
      // selectedImage: selectedImageForEditPath + queryParams.get("selectedImageForEdit") + `.jpg`,
      selectedImage: queryParams.get("selectedImage"),
    };
  };


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
    const { selectedImage: querySelectedImage } = getQueryParams();
    
    if (querySelectedImage) {
      setSelectedImage(decodeURIComponent(querySelectedImage));
    } else {
      setSelectedImage(editDefault);
    }
    const imageUrls = imageData.map(img => img.image_path);
    setImages(imageUrls); // 생성된 URL 목록을 상태에 저장
  }, [imageData]);

  const handleClick = (image) => {
    if (showCheckboxes) {
      if (checkedImages.includes(image)) {
        setCheckedImages(checkedImages.filter((img) => img !== image));
      } else {
        setCheckedImages([...checkedImages, image]);
      }
    } else {
      // 서버 요청 없이 클라이언트 측에서 이미지 처리
      console.log(`${image} is selected.`);
      setSelectedImage(image); // 클릭한 이미지 URL을 selectedImage 상태에 저장
    }
  };

  const handleCheckBox = () => {
    setShowCheckboxes(true);
  };

  const handleComplete = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/remove_background",
        {
          images: checkedImages,
        }
      );
      setRemovedImages(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error uploading images: ", error);
    }
    // setRemovedImages(response.data);

    setShowCheckboxes(false); // 체크박스 숨기기
    setCheckedImages([]); // 선택된 이미지 초기화
  };

  const handleCancel = () => {
    setShowCheckboxes(false);
    setCheckedImages([]);
  };

  // "배경 붙이기" 버튼의 이벤트 핸들러
  const handleStitchImages = async () => {
    if (checkedImages.length === 0) {
      alert("이미지를 선택해주세요.");
      return;
    }
    console.log(checkedImages);
    
    setIsLoading(true);
    try {
      setTimeout(async () => {

        const response = await axios.post("http://localhost:8000/stitch_images", {
          images: checkedImages, // 선택된 이미지들을 백엔드로 전송
        });
        // 스티칭 결과 처리 로직 (예: 결과 이미지 표시)
        console.log("Stitched image:", response.data.filename);
        setSelectedImage(response.data);
        setIsLoading(false); // 2초 후 로딩 종료
      }, 2000)
    } catch (error) {
      // 에러 메시지 표시
      if (error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert("예기치 못한 오류가 발생했습니다.");
      }
      setIsLoading(false); // 2초 후 로딩 종료
    }
  };

  // "처리된 이미지" 드래그 시작 처리
  const handleDragStart = (e, imageUrl) => {
    console.log(imageUrl);
    e.dataTransfer.setData("imageUrl", imageUrl);
  };

  // "선택된 이미지" 컨테이너에 드롭 처리
  const handleDrop = (e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData("imageUrl");
    if (!overlayContainerRef.current) return;

    const rect = overlayContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // 드롭된 위치의 X 좌표
    const y = e.clientY - rect.top; // 드롭된 위치의 Y 좌표
    const x_abs = e.clientX; // 드롭된 위치의 X 좌표
    const y_abs = e.clientY; // 드롭된 위치의 Y 좌표
    console.log("handle Drag ", !!imageUrl);

    if (!!imageUrl === false) {
      return;
    }

    setOverlayImages((prev) => [
      ...prev,
      { imageUrl, x, y, x_abs, y_abs, width: 100, height: 100 },
    ]);
  };

  // 드래그 시작 처리
  const handleDragImageStart = (e, index) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // 마우스 위치와 이미지 왼쪽 상단 간 X 차이
    const offsetY = e.clientY - rect.top; // 마우스 위치와 이미지 왼쪽 상단 간 Y 차이

    setDragging(true);
    setDraggingIndex(index);
    setOffsetX(offsetX);
    setOffsetY(offsetY);

    e.stopPropagation(); // 이벤트 버블링 방지
  };

  // 이미지 이동 처리
  const handleMouseMove = (e) => {
    if (!dragging || draggingIndex === null) return;
    const rect = overlayContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX; // offsetX를 고려하여 새로운 X 좌표 계산
    const y = e.clientY - rect.top - offsetY; // offsetY를 고려하여 새로운 Y 좌표 계산

    setOverlayImages((prev) =>
      prev.map((img, index) => {
        if (index === draggingIndex) {
          return {
            ...img,
            x,
            y,
            x_abs: e.clientX - offsetX,
            y_abs: e.clientY - offsetY,
          };
        }
        return img;
      })
    );
  };

  // 드래그 종료 처리
  const handleMouseUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    setDraggingIndex(null);
  };

  // 이미지 합성 요청
  const handleMergeImages = async () => {
    if (!selectedImage || overlayImages.length === 0) {
      alert("선택된 이미지가 없거나, 겹쳐진 이미지가 없습니다.");
      return;
    }
    console.log("select: ", selectedImage);
    console.log("overlay: ", overlayImages);
    setIsLoading(true);
    try {
      setTimeout(async () => {
        const response = await axios.post(
          "http://localhost:8000/merge_images",
          {
            baseImage: selectedImage,
            overlayImages,
          }
        );
        console.log("Merged image:", response.data);
        setIsLoading(false); // 2초 후 로딩 종료
      }, 2000);
    } catch (error) {
      console.error("Error merging images:", error);
      setIsLoading(false); // 2초 후 로딩 종료
    }
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Navbar />
      <LoadingModal isLoading={isLoading} /> {/* 모달 추가 */}
      <img src={bgImage} alt="background" className="edit-background-image" />
      <div className="image-container">
        <div className="image-container-list">
          <div className="image-container-navbar">
            {!showCheckboxes && (
              <button onClick={handleCheckBox}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                이미지선택
              </button>
            )}
            {showCheckboxes && (
              <button onClick={handleCancel}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                취소
              </button>
            )}
          </div>

          <div>
            <ul className="image-list">
              {images.map((image) => (
                <div
                  key={image}
                  className={`image-checkbox ${
                    checkedImages.includes(image) ? "selected" : ""
                  }`}
                  onClick={() => handleClick(image)}
                >
                  <img
                    className="image-element"
                    src={image}
                    alt={image}
                  />
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div className="show-container">
          <div
            className="edit-container"
            ref={overlayContainerRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="selected-image-header">
              <button onClick={handleComplete}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                배경 제거
              </button>
              <button onClick={handleStitchImages}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                배경 붙이기
              </button>
              <button onClick={handleMergeImages}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                편집 저장
              </button>
            </div>

            {/* {selectedImage && <img className='selected-image' src={selectedImage} alt="Selected" draggable="false" />} */}
            {/* {(selectedImageForEdit || selectedImage) && (
              <img
                className="selected-image"
                src={selectedImageForEdit || selectedImage}
                alt="Selected"
                draggable="false"
              />
            )} */}

            <div>
              <img
                className="selected-image"
                src={selectedImage}
                alt="Selected"
                draggable="false"
              />
            </div>

            {overlayImages.map((img, index) => (
              <ResizableBox
                key={index}
                width={img.width}
                height={img.height}
                onResizeStop={(e, { size }) => {
                  setOverlayImages((prev) =>
                    prev.map((image, idx) =>
                      idx === index
                        ? { ...image, width: size.width, height: size.height }
                        : image
                    )
                  );
                }}
                className="overlay-image"
                style={{
                  position: "absolute",
                  left: img.x_abs,
                  top: img.y_abs,
                }}
              >
                <img
                  src={img.imageUrl}
                  alt={`Overlay ${index}`}
                  draggable={false} // 내부 이미지는 드래그 불가능하게 설정
                  style={{ width: "100%", height: "100%" }} // ResizableBox에 맞게 이미지 크기 조정
                  onMouseDown={(e) => handleDragImageStart(e, index)} // 드래그 시작 이벤트 추가
                />
              </ResizableBox>
            ))}
          </div>
          <div className="removed-image-container">
            <h2>스티커</h2>
            <div className="removed-image-list">
              {removedImages.map((removedImage, index) => (
                <img
                  key={index}
                  src={removedImage}
                  alt={`removedImage ${index}`}
                  className="removed-image"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, removedImage)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
