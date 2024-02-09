import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Edit.css';

const Edit = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkedImages, setCheckedImages] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);

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
    console.log(checkedImages);
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/remove_background', {
        images: checkedImages
      })
      console.log('Image processed', response.data);
      setRemovedImages(response.data);
      console.log('removedImages now: ', removedImages);
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


  return (
    <div>
      <Navbar />
      <div className='image-container'>
        
        <div className='image-container-list'>
        
          <div className='image-container-navbar'>
            <h2>이미지 목록</h2>
            <button onClick={handleBackgroundRemoval}>배경 제거</button>
            <button>편집 저장</button>
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
          <div className='edit-container'>
            <h2>선택된 이미지</h2>
            {selectedImage && <img className='selected-image' src={selectedImage} alt="Selected" />}
          </div>

          <div className="rmoved-image-container">
            <h2>처리된 이미지</h2>
            {removedImages.map(removedImage => (
              <img key={removedImage} src={`/img_0/${removedImage}`} alt={removedImage} className="removed-image" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Edit;  