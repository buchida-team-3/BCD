import React, { useRef, useState } from 'react'
import { easing } from 'maath'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useAlbumList } from './AlbumListContext';

function AlbumListCard({ url, ...props }) {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    // const pointerOver = (e) => (e.stopPropagation(), hover(true))
    // const pointerOut = () => hover(false)
    const { setHoveredCard } = useAlbumList();

    const pointerOver = (e) => {
      e.stopPropagation();
      hover(true);
      setHoveredCard(url); // 호버된 카드의 URL을 상태로 설정
    };
    
    const pointerOut = () => {
      hover(false);
      setHoveredCard(null); // 호버가 해제되면 상태를 null로 설정
    };

    useFrame((state, delta) => {
      easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
      easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
      easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
    })
    
    return (
      <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut} {...props}>
        <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
      </Image>
    )
  }

export default AlbumListCard;