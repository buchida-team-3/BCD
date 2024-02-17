import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Edit.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; 
import editDefault from './content/edit_default.jpg'
import bgImage from './content/background.jpg'

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

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const overlayContainerRef = useRef(null); // 선택된 이미지를 담고 있는 컨테이너의 ref

  const getQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return {
        selectedImage: queryParams.get('selectedImage')
    };
  };

  useEffect(() => {
    const { selectedImage: querySelectedImage } = getQueryParams();

    if (querySelectedImage) {
      console.log(querySelectedImage);
      setSelectedImage(decodeURIComponent(querySelectedImage));
      console.log(selectedImage);
    }
    else {
      setSelectedImage(editDefault);
    }
    const loadImages = async () => {
      setLoading(true);
      setProgress(0);
      let progressInterval;
  
      // 프로그레스 바를 점진적으로 업데이트
      const updateProgress = () => {
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prevProgress + 10; // 예: 10%씩 증가
        });
      };

      // 프로그레스 바 업데이트 시작
      progressInterval = setInterval(updateProgress, 1000);
        // 실제 이미지 로딩 로직 (예: axios 요청)
        try {
          await axios.get('http://localhost:8000/api/images')
            .then(response => {
              setImages(response.data);
              // 이미지 로딩이 완료되면 프로그레스 바를 100%로 설정
              setProgress(100);
              // 잠시 후 로딩 상태를 false로 설정하여 프로그레스 바를 숨김
              setTimeout(() => setLoading(false), 500);
            });
        } catch (error) {
          console.error('Error fetching images:', error);
          setLoading(false);
        }
      };
      
    loadImages();
  }, []);

  const handleClick = (imageName) => {
    if (showCheckboxes) {
      if (checkedImages.includes(imageName)) {
        setCheckedImages(checkedImages.filter(img => img !== imageName));
      } else {
        setCheckedImages([...checkedImages, imageName]);
      }
    } else {
      // 배경 제거 모드가 아닌 경우의 기존 로직
      console.log(`${imageName} is selected.`);
      axios.get(`http://localhost:8000/api/images/${imageName}`)
        .then(response => {
          setSelectedImage(response.data.replace('../frontend/public/', './'));
          console.log(response.data.filename);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    }
  };

  const handleCheckboxChange = (imageName) => {
    if (checkedImages.includes(imageName)) {
      setCheckedImages(checkedImages.filter(img => img !== imageName));
    } else {
      setCheckedImages([...checkedImages, imageName]);
    }
  };

  const handleCheckBox = () => {
    setShowCheckboxes(true);
  };


  const handleComplete = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/remove_background', {
        images: checkedImages
      })
      setRemovedImages(response.data);
    }
    catch (error) {
      console.log('Error uploading images: ', error);
    }
    // setRemovedImages(response.data);

    setShowCheckboxes(false); // 체크박스 숨기기
    setCheckedImages([]); // 선택된 이미지 초기화
  };

  const handleCancel = () => {
    setShowCheckboxes(false);
    setCheckedImages([]);
  }

  // "배경 붙이기" 버튼의 이벤트 핸들러
  const handleStitchImages = async () => {
    if (checkedImages.length === 0) {
      alert("이미지를 선택해주세요.");
      return;
    }
    console.log(checkedImages);
    try {
      const response = await axios.post('http://localhost:8000/stitch_images', {
        images: checkedImages // 선택된 이미지들을 백엔드로 전송
      });
      // 스티칭 결과 처리 로직 (예: 결과 이미지 표시)
      console.log("Stitched image:", response.data.filename);
      setSelectedImage(response.data.replace('../frontend/public/', './'));
    } catch (error) {
      console.error("Error stitching images:", error);
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
  const handleMergeImages = async () => {
    if (!selectedImage || overlayImages.length === 0) {
      alert("선택된 이미지가 없거나, 겹쳐진 이미지가 없습니다.");
      return;
    }
    console.log('select: ', selectedImage);
    console.log('overlay: ',overlayImages);
    try {
      const response = await axios.post('http://localhost:8000/merge_images', {
        baseImage: selectedImage.replace('/img/', '../frontend/public/img/'),
        overlayImages
      });
      console.log("Merged image:", response.data);
      // 합성된 이미지를 처리하는 로직 (예: 합성된 이미지 표시)
    } catch (error) {
      console.error("Error merging images:", error);
    }
  };



  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Navbar />
      <img src={bgImage} alt="background" className="edit-background-image" />
      {loading && (
        <div className="progress-container">
          <div className="progress-bar" style={{width: `${progress}%`}}></div>
        </div>
      )}
      <div className='image-container'>
        
        <div className='image-container-list'>
        
          <div className='image-container-navbar'>
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
            <ul className='image-list'>
              {images.map(image => (
                <div key={image} className={`image-checkbox ${checkedImages.includes(image) ? 'selected' : ''}`} onClick={() => handleClick(image)}>
                  <img className='image-element' src={`./img/${image}`} alt={image} />
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div className='show-container'>
          <div className='edit-container' ref={overlayContainerRef} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <div className='selected-image-header'>
              <button onClick={handleComplete}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                배경 제거</button>
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
            {selectedImage && <img className='selected-image' src={selectedImage} alt="Selected" draggable="false" />}
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
                  src={`/img_0/${img.imageUrl}`}
                  alt={`Overlay ${index}`}
                  draggable={false} // 내부 이미지는 드래그 불가능하게 설정
                  style={{ width: '100%', height: '100%' }} // ResizableBox에 맞게 이미지 크기 조정
                  onMouseDown={(e) => handleDragImageStart(e, index)} // 드래그 시작 이벤트 추가
                />
              </ResizableBox>
            ))}
          </div>
          <div className='removed-image-container'>
            <h2>스티커</h2>
            <div className="removed-image-list">
              {removedImages.map((removedImage, index) => (
                <img
                key={index}
                src={`/img_0/${removedImage}`}
                alt={`removedImage ${index}`}
                className="removed-image"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, removedImage)} />
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Edit;  