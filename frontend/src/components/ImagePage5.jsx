import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './ScrollControls2'

import Overlay2 from './Overlay2'
import ImageContent5 from './ImageContent5'
import Navbar from './Navbar'

import './ImagePage.css'
import './LabelPage.css'

function ImagePage5() {
    return (
        <>
        <div className="label-page-container">
            <Navbar />
        <ImageContent5 />
        <Overlay2 />
        </div>
        
        </>

    )
}

export default ImagePage5