import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Edit.css";
import "./EditButton.css"
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import editDefault from "./content/edit_default.jpg";
import { useImageData } from "./ImageContext";

const Edit = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkedImages, setCheckedImages] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [overlayImages, setOverlayImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([
    "https://jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com/img_15/p993.jpg",
    "https://jungle-buchida-s3.s3.amazonaws.com/stitched_images/stitched_result_20240219_115602.jpg",
    "https://jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com/jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com_19/img7.jpg",
  ]);

  const overlayContainerRef = useRef(null);
  const { imageData, setImageData } = useImageData();
  const fullScreenRef = useRef(null);

  // 이미지를 추가하는 함수
  const handleMergeImages = () => {
    // 현재 이미지 목록을 복사합니다.
    let currentImages = [...images];

    // 추가할 이미지를 가져옵니다. (하나씩 순차적으로)
    if (additionalImages.length > 0) {
      const newImage = additionalImages[0]; // 첫 번째 이미지를 가져옵니다.

      // 이미지 중복 여부를 확인합니다.
      if (!currentImages.includes(newImage)) {
        // 현재 이미지 목록에 추가합니다.
        currentImages.push(newImage);
        
        // 상태를 업데이트합니다.
        setImages(currentImages);
        
        // 추가된 이미지는 추가 목록에서 제거합니다.
        setAdditionalImages(additionalImages.slice(1));
      }
    }
  };

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

  const fetchImages = async () => {
    // 모든 이미지 미리 비동기로 로딩하기
    const endpoint = '/api/all'
    try {
      const response = await axios.get(`http://localhost:8000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Label': '/api/all'
        }
      });

      console.log('/mainselect 이미지 데이터 로드:', response.data);
      
      // 이미지 데이터의 전역 상태 관리
      setImageData(response.data);
      setFetchAttempted(true); // 요청 실패 시에도 상태 업데이트

    } catch (error) {
      console.error('이미지 데이터 로드 중 오류 발생:', error);
      setFetchAttempted(true); // 요청 실패 시에도 상태 업데이트
    }
  };

  useEffect(() => {
    const { selectedImage: querySelectedImage } = getQueryParams();
    
    if (querySelectedImage) {
      setSelectedImage(decodeURIComponent(querySelectedImage));
    } else if (imageData.length > 0 && !selectedImage) {
        setSelectedImage(editDefault);
    }
    
    const imageUrls = imageData.map(img => img.image_path);
    setImages(imageUrls); // 생성된 URL 목록을 상태에 저장

    // 스크롤 바 설정
    const imageList = document.querySelector('.image-list');

    const showScrollbar = () => imageList.classList.add('scrolling');
    const hideScrollbar = () => imageList.classList.remove('scrolling');
  
    imageList.addEventListener('mouseover', showScrollbar);
    imageList.addEventListener('mouseleave', hideScrollbar);
    imageList.addEventListener('scroll', showScrollbar);
  
    // 스크롤바가 일정 시간 후에 자동으로 사라지도록 설정
    let scrollTimeout;
    imageList.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(hideScrollbar, 500); // 0.5초 후 스크롤바 숨김
    });
  
    return () => {
      imageList.removeEventListener('mouseover', showScrollbar);
      imageList.removeEventListener('mouseleave', hideScrollbar);
      imageList.removeEventListener('scroll', showScrollbar);
      clearTimeout(scrollTimeout);
    };

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

  const handleRemove = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/remove_background",
        {
          images: checkedImages,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      setRemovedImages(response.data);
      console.log(response.data);
      setIsLoading(false); // 2초 후 로딩 종료
    } catch (error) {
      // 에러 메시지 표시
      console.log(`error : ${error.response.data.detail}`);
      if (error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert("예기치 못한 오류가 발생했습니다.");
      }
      setIsLoading(false); // 2초 후 로딩 종료
    }
    // setRemovedImages(response.data);

    setShowCheckboxes(false); // 체크박스 숨기기
    setCheckedImages([]); // 선택된 이미지 초기화
  };

  const handleCancel = () => {
    setShowCheckboxes(false);
    setCheckedImages([]);
  };

  const handleFullScreen = () => {
    if (fullScreenRef.current.requestFullscreen) {
      fullScreenRef.current.requestFullscreen();
    } else if (fullScreenRef.current.webkitRequestFullscreen) { /* Safari */
      fullScreenRef.current.webkitRequestFullscreen();
    } else if (fullScreenRef.current.msRequestFullscreen) { /* IE11 */
      fullScreenRef.current.msRequestFullscreen();
    }
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
        const response = await axios.post("http://localhost:8000/stitch_images", {
          images: checkedImages, // 선택된 이미지들을 백엔드로 전송
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        // 스티칭 결과 처리 로직 (예: 결과 이미지 표시)
        console.log("Stitched image:", response.data.filename);
        setSelectedImage(response.data);
        setIsLoading(false); // 2초 후 로딩 종료
    } catch (error) {
      // 에러 메시지 표시
      console.log(`error : ${error.response.data.detail}`);
      if (error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert("예기치 못한 오류가 발생했습니다.");
      }
      setIsLoading(false); // 2초 후 로딩 종료
    }
  };


  // const handleStickerClick = (imageUrl) => {
  //   const image = new Image();
  //   image.src = imageUrl;
  //   image.onload = () => {
  //     const stickerWidth = 200;
  //     const stickerHeight = 400;
  
  //     // Get the dimensions and position of the selectedImage container
  //     const selectedImageRect = overlayContainerRef.current.getBoundingClientRect();
      
  //     // Calculate the center position of the sticker relative to the selectedImage
  //     // The x and y coordinates should represent the top-left corner of the sticker
  //     // so that when the sticker's center is aligned to the selectedImage's center
  //     const xCenter = selectedImageRect.width / selectedImageRect.width;
  //     const yCenter = selectedImageRect.height / selectedImageRect.height;
      
  //     // Adjust the sticker position to be a percentage of the selectedImage dimensions
  //     const x = xCenter - 2 * stickerWidth / selectedImageRect.width - 2 * xCenter / stickerWidth;
  //     const y = yCenter - stickerHeight / selectedImageRect.height;
      
  //     setOverlayImages((prev) => [
  //       ...prev,
  //       {
  //         imageUrl,
  //         x, // X position as a percentage of the selectedImage width
  //         y, // Y position as a percentage of the selectedImage height
  //         width: stickerWidth,
  //         height: stickerHeight,
  //       },
  //     ]);
  //   };
  // };
// "처리된 이미지" 드래그 시작 처리
const handleDragStart = (e, imageUrl) => {
  console.log(imageUrl);
  e.dataTransfer.setData("imageUrl", imageUrl);
};
// "선택된 이미지" 컨테이너에 드롭 처리
const handleDrop = (e) => {
  e.preventDefault();
  const imageUrl = e.dataTransfer.getData("imageUrl");
  if ( !overlayContainerRef.current ) return;
  const rect = overlayContainerRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left; // 드롭된 위치의 X 좌표
  const y = e.clientY - rect.top; // 드롭된 위치의 Y 좌표
  const x_abs = e.clientX; // 드롭된 위치의 X 좌표
  const y_abs = e.clientY; // 드롭된 위치의 Y 좌표
  console.log('handle Drag ', !!imageUrl)
  if(!!imageUrl === false){
    return;
  }

  setOverlayImages(prev => [...prev, { imageUrl, x, y, x_abs, y_abs, width: 100, height: 100 }]);
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

  setOverlayImages(prev => prev.map((img, index) => {
    if (index === draggingIndex) {
      return { ...img, x, y, x_abs: e.clientX - offsetX, y_abs: e.clientY - offsetY };
    }
    return img;
  }));
};
// 드래그 종료 처리
const handleMouseUp = (e) => {
  if (!dragging) return;
  setDragging(false);
  setDraggingIndex(null);
};

  // 이미지 합성 요청
  // 이미지 카드에 사용될 더미 이미지 URL
const dummyImageUrl = "https://example.com/dummy_image.jpg";

// "편집 저장" 버튼의 이벤트 핸들러
// "편집 저장" 버튼의 이벤트 핸들러


// 이미지를 추가하는 함수
// "편집 저장" 버튼의 이벤트 핸들러


  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className={'main-container'}>
      <Navbar />
      <LoadingModal isLoading={isLoading} /> {/* 모달 추가 */}
      {/*전체 컨테이너*/}
      <div className="image-container">
        {/*좌측 컨테이너*/}
        <div className="image-container-list">
          <div className="image-container-navbar">
            <div className={'content-title'}>이미지</div>
            {!showCheckboxes && (
                <button className="edit-button" onClick={handleCheckBox}>
                  선택
                </button>
            )}
            {showCheckboxes && (
                <button className="edit-button" onClick={handleCancel}>
                  취소
                </button>
            )}
          </div>

          <div className="image-box">
            <div className="image-list">
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
            </div>
          </div>
        </div>

        {/*우측 컨테이너*/}
          {/*편집 파트*/}
          <div
              className="edit-container"
              ref={overlayContainerRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
          >
            <div className={'edit-title'}>
              <div className={'content-title'}>편집</div>
              <div>
                <button className="edit-button" onClick={handleRemove}>
                  배경 제거
                </button>
                <button className="edit-button" onClick={handleStitchImages}>
                  배경 붙이기
                </button>
                <button className="edit-button" onClick={handleMergeImages}>
                  편집 저장
                </button>
                <button className="edit-button" onClick={handleFullScreen}>
                  전체화면
                </button>
              </div>
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

            <div ref={fullScreenRef}>
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
                  setOverlayImages(prev =>
                    prev.map((image, idx) => idx === index ? { ...image, width: size.width, height: size.height } : image)
                  );
                }}
                className="overlay-image"
                style={{ position: 'absolute', left: img.x_abs, top: img.y_abs }}
              >
                <img  
                  src={img.imageUrl}
                  alt={`Overlay ${index}`}
                  draggable={false} // 내부 이미지는 드래그 불가능하게 설정
                  style={{ width: '600%', height: '600%' }} // ResizableBox에 맞게 이미지 크기 조정
                  onMouseDown={(e) => handleDragImageStart(e, index)} // 드래그 시작 이벤트 추가
                />
              </ResizableBox>
            ))}
          </div>

          {/*스티커 파트*/}
          <div className="removed-image-container">
            <div className={'content-title'}>스티커</div>
            <div className={'temp'}></div>
            <div className="removed-image-list">
              {removedImages.map((removedImage, index) => (
                  <img
                      key={index}
                      src={removedImage}
                      alt={`removedImage ${index}`}
                      className="removed-image"
                      draggable="true"
                      // onClick={() => handleStickerClick(removedImage)} // 클릭 이벤트에 핸들러 연결
                      onDragStart={(e) => handleDragStart(e, removedImage)}
                  />
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Edit;
