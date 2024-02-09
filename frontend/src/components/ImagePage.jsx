// 삭제하면 안됨
import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './ScrollControls'

import Overlay from './Overlay'
import ImageContent from './ImageContent'

import './ImagePage.css'

function ImagePage() {
    return (
        <>
        <ImageContent />
        <Overlay />
        </>
        
    )
}

export default ImagePage