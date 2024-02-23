import React, { useRef, useState } from 'react';
import { easing } from 'maath';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';
import { useAlbumList } from './AlbumListContext';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

function AlbumListCard({ url, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const { setHoveredCard } = useAlbumList();
  const navigate = useNavigate(); // useNavigate 훅 호출

  const pointerOver = (e) => {
    e.stopPropagation();
    hover(true);
    setHoveredCard(url); // 호버된 카드의 URL을 상태로 설정
  };

  const pointerOut = () => {
    hover(false);
    setHoveredCard(null); // 호버가 해제되면 상태를 null로 설정
  };

  const handleCardClick = () => {
    // 예시 URL에 따라 다른 페이지로 navigate하는 로직
    if (url === '/title1.jpg') {
      navigate('/imagepage2');
    } else if (url === '/title2.jpg') {
      navigate('/imagepage3');
    } else if (url === '/title3.jpg') {
      navigate('/imagepage4');
    } else if (url === '/title4.jpg') {
      navigate('/imagepage5');
    } else if (url === '/title5.jpg') {
      navigate('/imagepage6');
    }
  };

  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta);
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta);
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta);
  });

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      onClick={handleCardClick} // 클릭 이벤트 핸들러에 handleCardClick 함수 연결
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}

export default AlbumListCard;
