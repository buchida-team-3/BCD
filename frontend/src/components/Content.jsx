import React from 'react';
// import '.UploadButton.css';
// import UploadButton from './UploadButton';
import './Content.css';
import uploadImage from './content/upload-icon.png';

function Content() {
    return (
        <div className="content">
            <img src={uploadImage} alt="업로드 이미지" className="upload-image" />
            <div className="upload-text">
                <p>아직 등록된 사진이 없어요!</p>
                <p>여러분의 추억을 공유해주세요.</p>
            </div>
            <input type="file" id="fileInput" multiple style={{ display: 'none' }} />
            <button className="upload-button" onClick={uploadFiles}>지금 올리기</button>
        </div>
    );
}

function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    fileInput.setAttribute('multiple', true);
    fileInput.click();

    fileInput.addEventListener('change', function () {
        const selectedFiles = fileInput.files;
        if (selectedFiles.length > 0) {
            const formData = new FormData();

            // 선택한 모든 파일을 FormData에 추가
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('files[]', selectedFiles[i]);
            }

            // 서버로 파일 업로드 (서버 측 코드 필요)
            fetch('http://localhost:8000/group/album/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        alert('파일 업로드 성공!');
                    } else {
                        alert('파일 업로드 실패.');
                    }
                })
                .catch(error => {
                    console.error('파일 업로드 중 오류 발생:', error);
                });
        }
    });
}

export default Content;
