import * as THREE from 'three'
import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './ScrollControls'
import axios from 'axios'

function Image(props) {
  const ref = useRef();
  const group = useRef();
  const data = useScroll();
  useFrame((state, delta) => {
      group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta);
      const targetGrayscale = Math.max(0, 1 - data.delta * 1000);
      ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.min(targetGrayscale, 0.1), 4, delta);
  });
  // 클릭 이벤트 핸들러 추가
  const handleClick = () => {
      // URL에서 파일 이름 추출 ('/image1.jpeg' -> 'image1')
      const imageName = props.url.split('/').pop().split('.').shift();
      // 'edit/' 경로와 함께 리디렉션
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
  const w = width < 10 ? 1.5 / 3 : 1 / 3;
  return (
      <group {...props}>
          <Image position={[-width * w, 0, -1]} scale={[width * w - m * 2, 5, 1]} url={urls} />
          
      </group>
  );
}
function Pages({ imageGroups }) {
  const { width } = useThree((state) => state.viewport);
  const pageWidth = width / 3; // 페이지 너비 (화면 너비의 1/3)

  return (
    <>
      {imageGroups && imageGroups.map((urls, index) => ( // imageGroups가 undefined일 경우를 대비한 체크
        <Page key={index} position={[index * pageWidth, 0, 0]} urls={urls} />
      ))}
    </>
  );
}

export default function ImageContent() {
  const [imageGroups, setImageGroups] = useState([]); // imageGroups를 빈 배열로 초기화

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/album', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setImageGroups(response.data); // axios는 자동으로 JSON을 파싱해줍니다.
      } catch (error) {
        console.error('Failed to fetch images:', error);
        window.location.href = '/loginandsignup';
      }
    };

    fetchImages();
  }, []);

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ScrollControls infinite horizontal damping={4} pages={imageGroups.length} distance={1}>
          <Scroll>
            <Pages imageGroups={imageGroups} />
          </Scroll>
          <Scroll html>
            {/* 화면 내 글씨들 */}
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}