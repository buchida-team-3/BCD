import React, { useRef } from 'react';
import './Content.css';
import uploadImage from './content/upload-icon.png';

function Content() {
    const fileInputRef = useRef(null);

    const uploadFiles = async () => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            fileInput.setAttribute('multiple', true);
            fileInput.click();
        }
    };

    const handleChange = async () => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            const selectedFiles = fileInput.files;
            if (selectedFiles.length > 0) {
                const formData = new FormData();

                // 선택한 모든 파일을 FormData에 추가
                for (let i = 0; i < selectedFiles.length; i++) {
                    formData.append('files', selectedFiles[i]);
                }

                try {
                    const response = await fetch('http://localhost:8000/group/album/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        alert('파일 업로드 성공!');
                    } else {
                        alert('파일 업로드 실패.');
                    }
                } catch (error) {
                    console.error('파일 업로드 중 오류 발생:', error);
                }
            }
        }
    };

    return (
        <div className="content">
            <img src={uploadImage} alt="업로드 이미지" className="upload-image" />
            <div className="upload-text">
                <p>아직 등록된 사진이 없어요!</p>
                <p>여러분의 추억을 공유해주세요.</p>
            </div>
            <input type="file" id="fileInput" multiple style={{ display: 'none' }} ref={fileInputRef} onChange={handleChange} />
            <button className="upload-button" onClick={uploadFiles}>지금 올리기</button>
        </div>
    );
}

export default Content;
