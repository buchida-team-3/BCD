import * as THREE from 'three';
import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, Image as ImageImpl } from '@react-three/drei';
import { ScrollControls, Scroll, useScroll } from './LabelScrollControls';
import axios from 'axios';
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

export default function ImageContent() {
  const [imageGroups, setImageGroups] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/album', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Label': 'img_label_0'
          }
        });
        // Format or split the response data into groups of 3 URLs for each Page
        const formattedGroups = response.data.map((_, index, array) => 
          index % 3 === 0 ? array.slice(index, index + 3) : null
        ).filter(Boolean);
        setImageGroups(formattedGroups);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        window.location.href = '/loginandsignup';
      }
    };

    fetchImages();
  }, []);

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
