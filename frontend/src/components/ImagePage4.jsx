import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './ScrollControls2'

import Overlay2 from './Overlay2'
import ImageContent4 from './ImageContent4'

import './ImagePage.css'

function ImagePage4() {
    return (
        <>
        <ImageContent4 />
        <Overlay2 />
        </>

    )
}

export default ImagePage4