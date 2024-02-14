import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ScrollControls, Scroll } from './AlbumListScrollControls';
import bgImage from './content/background.jpg';
import pageImage from './images/image.jpg'; // 페이지에 들어갈 이미지 경로 추가

// PageCover 컴포넌트 정의
const PageCover = ({ children }) => (
  <div style={{ width: '250px', height: '300px', backgroundColor: '#e3d0b5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px' }}>
    {children}
  </div>
);

// Text 컴포넌트 정의
const Text = ({ title }) => (
  <h2 style={{ color: '#ffffff' }}>{title}</h2> // 텍스트의 색상을 하얀색으로 변경
);

// Page 컴포넌트 정의
function Page({ title, position }) {
  return (
    <group position={position}>
      <Html>
        <group>
          <PageCover>
            <img src={pageImage} alt="Page" style={{ width: '100%', height: '100%' }} />
          </PageCover>
          <Text title={title} /> {/* 텍스트가 이미지 아래로 위치하도록 변경 */}
        </group>
      </Html>
    </group>
  );
}
export default function ImageContent() {
  // 페이지들의 위치를 조정하여 가로 방향으로 2줄에 걸쳐 중앙에 배열
  const pages = Array.from({ length: 10 }).map((_, index) => {
    const row = Math.floor(index / 5); // 2줄 구성
    const col = index % 5; // 가로로 5개 페이지
    // 각 페이지의 x, y 위치를 조정하여 간격을 넓힙니다.
    // 가로 간격을 넓히기 위해 x 위치 계산을 수정합니다.
    const x = col * 2.8 - 6.5; // 가로 간격을 넓혀 겹치지 않게 조정
    const y = 3.3 - row * 3.3; // 세로 위치 조정
    return { title: `Page ${index + 1}`, position: [x, y, 0] };
  });

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} style={{ backgroundImage: `url(${bgImage})`, width: '100%', height: '100vh' }}>
      <Suspense fallback={null}>
        <ScrollControls pages={5} distance={1} damping={4} horizontal={true} infinite={false}>
          <Scroll>
            {pages.map((page, index) => (
              <Page key={index} title={page.title} position={page.position} />
            ))}
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
