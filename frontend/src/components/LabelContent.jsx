import * as THREE from 'three';
import axios from 'axios';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Image as ImageImpl } from '@react-three/drei';
import { ScrollControls, Scroll, useScroll } from './LabelScrollControls';
import { useImageData } from './ImageContext';

import bgImage from './content/background.jpg';

function Image(props) {
  const ref = useRef();
  const group = useRef();
  // useFrame에서 흑백 처리 관련 코드를 제거합니다.
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, 0), 4, delta);
  });

  const handleClick = () => {
    const imageName = props.url.split('/').pop().split('.').shift();
    window.location.href = `/edit/${imageName}`;
  };

  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} onClick={handleClick} />
    </group>
  );
}

function Page({ m = 0.4, urls, ...props }) {
  const { width } = useThree((state) => state.viewport);
  // Adjust the scale and position to make images smaller and overlapped
  const scale = [2, 2, 1]; // Adjust scale as needed
  const positions = [
    [-0.5, 0.5, 0], // Image 1 position
    [0, 0, 0.1], // Image 2 position, slightly in front/behind the first
    [0.5, -0.5, 0.2], // Image 3 position, slightly in front/behind the second
  ];

  return (
    <group {...props}>
      {urls.map((url, index) => (
        <Image key={index} position={positions[index]} scale={scale} url={url} />
      ))}
    </group>
  );
}

function Pages({ imageGroups }) {
  const { viewport } = useThree();
  // Define the horizontal spacing between each page group
  const groupWidth = viewport.width / (imageGroups.length / 2);

  return (
    <>
      {imageGroups.map((group, index) => {
        // Determine the vertical position: all items in the first row, then all items in the second row
        const y = index < imageGroups.length / 2 ? -viewport.height / 4 : viewport.height / 4;
        // Determine the horizontal position: incrementally increase based on the group index
        // For the second row, reset the index to start from 0 again
        const xOffset = index < imageGroups.length / 2 ? index : index - (imageGroups.length / 2);
        const x = -(viewport.width / 2) + (xOffset * groupWidth) + groupWidth / 2; // Adjust this calculation as needed

        return (
          <Page
            key={index}
            urls={group}
            position={[x, y, 0]}
          />
        );
      })}
    </>
  );
}

export default function LabelContent({ filterLabel }) {
  const [ imageGroups, setImageGroups ] = useState([]);

  // imageData: 이미지 데이터 자체, setImageData: 이미지 데이터를 변경하는 함수
  const { imageData, setImageData } = useImageData(); // Context API 사용을 위해 추가 -> 여기에서 이미 imageData를 사용할 준비가 됨
  
  console.log('filterLabel 변경:', filterLabel);
  useEffect(() => {
    const fetchImages = async () => {
      // filterLabel 상태에 따라 로직 변경
      const endpoint = filterLabel === "Filtering" ? '/api/all' : '/api/filter';
      try {
        const response = await axios.get(`http://localhost:8000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Label': filterLabel
          }
        });
        
        // 이미지 데이터를 로컬 스토리지에 저장 -> 현재 response.data는 image의 모든 정보를 담고 있음
        // 예시:
        // {
        // class_name: "['person']",
        // id: 114,
        // image_edited: false,
        // image_lable_rgb: 2,
        // image_meta: "('2023:04:09 10:41:58', 37.513930555555554, 127.10469166666667)",
        // image_name: "IMG_2206.jpeg",
        // image_path: "https://jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com/img_20/IMG_2206.jpeg",
        // user_id: 8
        // }

        // Context API: 이미지 데이터를 전역 상태로 관리
        setImageData(response.data);

        // 이미지 3장씩 그룹화, 전역으로 관리되는 이미지 데이터를 사용
        const image_path = response.data.map((image) => image.image_path);
        const formattedGroups = image_path.map((_, index, array) => 
          index % 3 === 0 ? array.slice(index, index + 3) : null
        ).filter(Boolean);

        setImageGroups(formattedGroups);

      } catch (error) {
        console.error('Failed to fetch images:', error);
        window.location.href = '/loginandsignup';
      }
    };

    // 이미 로드된 이미지 데이터 가져오기
    // 이미지의 캐시 여부 확인
    if (imageData.length === 0) {
      console.log('LabelContent.jsx: 이미지 데이터 캐시에 없음');
      fetchImages();
    } else {
      console.log('LabelContent.jsx: 이미지 데이터 캐시에 있음');
      const image_path = imageData.map((image) => image.image_path);
      const formattedGroups = image_path.map((_, index, array) => 
        index % 3 === 0 ? array.slice(index, index + 3) : null
      ).filter(Boolean);

      setImageGroups(formattedGroups);
    }

  }, [ filterLabel, setImageData, imageData ]);

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} style={{ backgroundImage: `url(${bgImage})` }}>
      <Suspense fallback={null}>
        <ScrollControls pages={imageGroups.length / 7} distance={1} damping={4} horizontal={true} infinite={false}>
          <Scroll>
            <Pages imageGroups={imageGroups} />
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
