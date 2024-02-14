import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ScrollControls, Scroll } from './AlbumListScrollControls';
import bgImage from './content/background.jpg';
import pageImage from './images/image.jpg';

const PageCover = ({ children }) => (
  <div style={{ width: '250px', height: '300px', backgroundColor: '#e3d0b5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px' }}>
    {children}
  </div>
);

const Text = ({ title }) => (
  <h2 style={{ color: '#ffffff' }}>{title}</h2>
);

function Page({ title, position }) {
  return (
    <group position={position}>
      <Html>
        <group>
          <PageCover>
            <img src={pageImage} alt="Page" style={{ width: '100%', height: '100%' }} />
          </PageCover>
          <Text title={title} />
        </group>
      </Html>
    </group>
  );
}

export default function ImageContent() {
  const pages = Array.from({ length: 10 }).map((_, index) => {
    // 각 페이지를 세로로 배열하기 위해 x 위치를 0으로 고정하고, y 위치를 조정하여 한 열에 표시합니다.
    const x = 0;
    const y = index * -3.5; // 각 페이지 간의 세로 간격을 조정합니다.
    return { title: `Page ${index + 1}`, position: [x, y, 0] };
  });

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} style={{ backgroundImage: `url(${bgImage})`, width: '100%', height: '100vh' }}>
      <Suspense fallback={null}>
        <ScrollControls pages={5} distance={1} damping={4} horizontal={false} infinite={false}> {/* horizontal 속성을 false로 변경하여 수직 스크롤링으로 변경 */}
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
