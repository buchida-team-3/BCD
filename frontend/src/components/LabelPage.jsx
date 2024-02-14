import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './LabelScrollControls'

import LabelOverlay from './LabelOverlay'
import LabelContent from './LabelContent'

import './LabelPage.css'

function LabelPage() {
    return (
        <>
        <LabelContent />
        <LabelOverlay />
        </>
    )
}

export default LabelPage