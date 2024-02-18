// https://cydstumpel.nl/

import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import './AlbumListUtil.jsx'
import bgImage from './content/background.jpg';

import AlbumListOverlay2 from './AlbumListOverlay2.jsx'
import AlbumListCard from './AlbumListCard.jsx'
import AlbumListRig from './AlbumListRig.jsx'
import AlbumListCarousel from './AlbumListCarousel.jsx'

export const AlbumListContent2 = () => (
  <Canvas style={{ backgroundImage: `url(${bgImage})`, width: '100%', height: '100vh' }} camera={{ position: [0, 0, 100], fov: 15 }}>
    <fog attach="fog" args={['#a79', 8.5, 12]} />
    <ScrollControls pages={4} infinite>
      <AlbumListRig rotation={[0, 0, 0.15]}>
        <AlbumListCarousel />
      </AlbumListRig>
    </ScrollControls>
  </Canvas>
)

export default AlbumListContent2;