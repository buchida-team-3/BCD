import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Edit.css';

const Edit = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkedImages, setCheckedImages] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [overlayImages, setOverlayImages] = useState([]); // 겹쳐진 이미지들의 정보 배열
  const overlayContainerRef = useRef(null); // 선택된 이미지를 담고 있는 컨테이너의 ref

  useEffect(() => {
    axios.get('http://localhost:8000/api/images')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }, []);

  const handleClick = (imageName) => {
    // 선택된 이미지 불러오기
    if ( !showCheckboxes ) {
      axios.get(`http://localhost:8000/api/images/${imageName}`)
        .then(response => {
          setSelectedImage(response.data);
          console.log(response.data);
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

  const handleBackgroundRemoval = () => {
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
    setOverlayImages(prev => [...prev, { imageUrl, x, y, x_abs, y_abs }]);
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
    <div>
      <Navbar />
      <div className='image-container'>
        
        <div className='image-container-list'>
        
          <div className='image-container-navbar'>
            <h2>이미지 목록</h2>
            <button onClick={handleBackgroundRemoval}>배경 제거</button>
            <button onClick={handleMergeImages}>편집 저장</button>
          </div>

          <div>
            <ul className='image-list'>
              {images.map(image => (
                <div key={image} className='image-checkbox'>
                  {showCheckboxes && (
                    <input type='checkbox' onChange={() => handleCheckboxChange(image)} checked={checkedImages.includes(image)} />
                  )}

                  <div onClick={() => handleClick(image)}>{image}</div>
                </div>
              ))}
            </ul>
            {showCheckboxes && (
            <div>
              <button onClick={handleComplete}>완료</button>
              <button onClick={handleCancel}>취소</button>
            </div>
            )}
          </div>
        </div>

        <div>
          <div className='edit-container' ref={overlayContainerRef} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <h2>선택된 이미지</h2>
            {selectedImage && <img className='selected-image' src={selectedImage} alt="Selected" />}
            {overlayImages.map((img, index) => (
              <img
                key={index}
                src={`/img_0/${img.imageUrl}`}
                alt={`Overlay ${index}`}
                className="overlay-image"
                style={{ position: 'absolute', left: img.x_abs, top: img.y_abs }}
              />
            ))}
          </div>

          <div className="removed-image-container">
            <h2>처리된 이미지</h2>
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
  );
}

export default Edit;  