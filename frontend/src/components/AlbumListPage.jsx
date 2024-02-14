import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './AlbumListScrollControls'

import AlbumListOverlay from './AlbumListOverlay'
import AlbumListContent from './AlbumListContent'

import './AlbumListPage.css'

function AlbumListPage() {
    return (
        <>
        <AlbumListContent />
        <AlbumListOverlay />
        </>
    )
}

export default AlbumListPage