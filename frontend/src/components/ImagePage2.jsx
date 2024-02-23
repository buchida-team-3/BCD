import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './ScrollControls2'

import Overlay2 from './Overlay2'
import ImageContent2 from './ImageContent2'

import './ImagePage.css'
import Navbar from './Navbar'
import './LabelPage.css'

function ImagePage2() {
    return (
        <>
        <div className="label-page-container">
            <Navbar />
        <ImageContent2 />
        <Overlay2 />
        </div>
        
        </>

    )
}

export default ImagePage2