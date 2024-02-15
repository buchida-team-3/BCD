import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ScrollControls, Scroll } from './AlbumListScrollControls';
import bgImage from './content/background.jpg';
import './AlbumListContent.css';
import image1 from './images/image1.jpeg';
import image2 from './images/image2.jpeg';
import image3 from './images/image3.jpeg';
import image4 from './images/image4.jpeg';
import image5 from './images/image5.jpeg';

const images = [image1, image2, image3, image4, image5];

const PageCover = ({ children, title, image }) => (
  <div className="page-cover2">
    <div className="image-container">
      <img src={image} alt="Page" className="cover-image"/>
    </div>
    <div className="title-container">
      <Text title={title} />
    </div>
    {children}
  </div>
);

const Text = ({ title }) => (
  <h2 style={{ color: '#ffffff' }}>{title}</h2>
);

function Page({ title, position, image }) {
  return (
    <group position={position}>
      <Html>
        <group>
          <PageCover image={image} title={title}>
          </PageCover>
        </group>
      </Html>
    </group>
  );
}

export default function AlbumListContent() {
  const pages = Array.from({ length: 5 }).map((_, index) => {
    const image = images[index];
    const x = index * 6.0 - 5.2;
    const y = 3.1;
    return {  position: [x, y, 0], image };
  });

  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]} style={{ backgroundImage: `url(${bgImage})`, width: '100%', height: '100vh' }}>
      <Suspense fallback={null}>
        <ScrollControls pages={2.6} distance={1} damping={4} horizontal={true} infinite={false}>
          <Scroll>
            {pages.map((page, index) => (
              <Page key={index} title={page.title} position={page.position} image={page.image} />
            ))}
          </Scroll>
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}
