import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ScrollControls, Scroll } from './AlbumListScrollControls';
import bgImage from './content/background.jpg';
import pageImage from './images/image.jpg';
import './AlbumListContent.css';

const PageCover = ({ children, title }) => (
  <div className="page-cover">
    <div className="image-container">
      {/* 이미지 컨테이너 추가 */}
      <img src={pageImage} alt="Page" className="cover-image"/>
    </div>
    <div className="title-container">
      {/* 텍스트 컨테이너 추가 */}
      <Text title={title} />
    </div>
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
            {/* <img src={pageImage} alt="Page" style={{ width: '90%', height: '90%' }} /> */}
            <Text title={title} />
          </PageCover>
          {/* <Text title={title} /> */}
        </group>
      </Html>
    </group>
  );
}

export default function AlbumListContent() {
  const pages = Array.from({ length: 10 }).map((_, index) => {
    // 가로 1열로 배치하기 위해 y 위치를 고정하고, x 위치를 조정하여 각 페이지가 가로로 표시되도록 합니다.
    const x = index * 6.0 - 5.2; // 각 페이지 간의 가로 간격을 조정합니다.
    const y = 3.1;
    return { title: `Page ${index + 1}`, position: [x, y, 0] };
  });

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} style={{ backgroundImage: `url(${bgImage})`, width: '100%', height: '100vh' }}>
      <Suspense fallback={null}>
        <ScrollControls pages={2.6} distance={1} damping={4} horizontal={true} infinite={false}> {/* horizontal 속성을 true로 변경하여 가로 스크롤링을 활성화합니다. */}
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
