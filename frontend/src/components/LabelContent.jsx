import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Image as ImageImpl } from '@react-three/drei'
import { ScrollControls, Scroll, useScroll } from './ScrollControls'

function Image(props) {
  const ref = useRef()
  const group = useRef()
  const data = useScroll()
  useFrame((state, delta) => {
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, data.delta * 50), 4, delta)
    ref.current.material.grayscale = THREE.MathUtils.damp(ref.current.material.grayscale, Math.max(0, 1 - data.delta * 1000), 4, delta)
  })
  return (
    <group ref={group}>
      <ImageImpl ref={ref} {...props} />
    </group>
  )
}

function Page({ m = 0.05, urls, ...props }) { // m 값을 조정하여 간격을 더욱 줄일 수 있습니다.
  const { width } = useThree((state) => state.viewport);
  const w = width < 10 ? 1.5 / 3 : 1 / 3;
  const overlap = 0.1; // 이미지들이 얼마나 겹칠지 결정하는 값, 값이 작을수록 이미지들은 더 겹칩니다.

  return (
    <group {...props}>
      {/* 이미지들의 x 위치를 overlap을 사용하여 조정 */}
      <Image position={[-width * w * overlap, -0.5, -0.1]} scale={[width * w - m * 2, 5, 1]} url={urls[0]} />
      <Image position={[0, 0, 0]} scale={[width * w - m * 2, 5, 1]} url={urls[1]} />
      <Image position={[width * w * overlap, 0.5, 0.1]} scale={[width * w - m * 2, 5, 1]} url={urls[2]} />
    </group>
  );
}

function Pages() {
  const { width } = useThree((state) => state.viewport);
  const pageOffset = width * 0.6; // 페이지 간의 간격을 결정하는 값, 값을 줄여 간격을 좁힐 수 있습니다.

  return (
    <>
      {/* 각 Page 컴포넌트의 position을 pageOffset을 사용하여 조정하여 페이지 간 간격을 줄입니다. */}
      <Page position={[-pageOffset * 4, 0, 0]} urls={['image4.jpeg', '/image5.jpeg', '/image6.jpeg']} />
      <Page position={[-pageOffset * 3, 0, 0]} urls={['/image7.jpeg', '/image8.jpeg', '/image9.jpeg']} />
      <Page position={[-pageOffset * 2, 0, 0]} urls={['/image10.jpeg', '/image11.jpeg', '/image12.jpeg']} />
      <Page position={[-pageOffset * 1, 0, 0]} urls={['/image1.jpeg', '/image2.jpeg', '/image3.jpeg']} />
      <Page position={[pageOffset * 0, 0, 0]} urls={['image13.jpeg', '/image14.jpeg', '/image15.jpeg']} />
      <Page position={[pageOffset * 1, 0, 0]} urls={['image4.jpeg', '/image5.jpeg', '/image6.jpeg']} />
      <Page position={[pageOffset * 2, 0, 0]} urls={['/image7.jpeg', '/image8.jpeg', '/image9.jpeg']} />
      <Page position={[pageOffset * 3, 0, 0]} urls={['/image10.jpeg', '/image11.jpeg', '/image12.jpeg']} />
      <Page position={[pageOffset * 4, 0, 0]} urls={['/image1.jpeg', '/image2.jpeg', '/image3.jpeg']} />
      <Page position={[pageOffset * 5, 0, 0]} urls={['image13.jpeg', '/image14.jpeg', '/image15.jpeg']} />
    </>
  );
}

export default function LabelContent() {
  return (
    <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <ScrollControls infinite horizontal damping={4} pages={3.5} distance={1}>
          <Scroll>
            <Pages />
          </Scroll>
          <Scroll html>
          </Scroll>
        </ScrollControls>
        <Preload />
      </Suspense>
    </Canvas>
  )
}
