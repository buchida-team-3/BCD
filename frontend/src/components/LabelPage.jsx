import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './LabelScrollControls'

import Navbar from './Navbar'
import LabelOverlay from './LabelOverlay'
import LabelContent from './LabelContent'

import './LabelPage.css'

function LabelPage() {
    const [filterLabel, setFilterLabel] = useState("Filtering");

    const toggleFilterLabel = () => {
        setFilterLabel(currentLabel => currentLabel === "Filtering" ? "All" : "Filtering");
    };

    return (
        <>
        <Navbar />
        <LabelContent filterLabel={filterLabel} />
        <LabelOverlay onToggleFilterLabel={toggleFilterLabel} filterLabel={filterLabel} />
        </>
    )
}

export default LabelPage