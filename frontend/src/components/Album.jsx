import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import getUuid from 'uuid-by-string'
import './Gallery.css';
const GOLDENRATIO = 1.61803398875

// 갤러리 컴포넌트
const Gallery = ({ images }) => {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
      {/* 배경 색상 설정 */}
      <color attach="background" args={['#191920']} />
      {/* 안개 설정 */}
      <fog attach="fog" args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        {/* 프레임과 반사 효과를 가진 이미지 렌더링 */}
        <Frames images={images} />
        {/* 반사 효과를 가진 평면 생성 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#151515"
            metalness={0.5}
          />
        </mesh>
      </group>
      {/* 3D 환경 렌더링 */}
      <Environment preset="city" />
    </Canvas>
  )
}

// 갤러리 컴포넌트에서 사용되는 Frames 컴포넌트
function Frames({ images }) {
  // useRef를 통해 프레임과 클릭된 아이템에 대한 참조 생성
  const ref = useRef();
  const clicked = useRef();
  // 현재 라우터 파라미터와 로케이션을 가져오기 위해 useRoute와 useLocation 훅 사용
  const [, params] = useRoute('/item/:id');
  const [, setLocation] = useLocation();
  
  // 클릭된 프레임의 ID를 저장할 상태 추가
  const [clickedFrameId, setClickedFrameId] = useState(null);

  const p = new THREE.Vector3();
  const q = new THREE.Quaternion();

  // useEffect를 사용하여 라우터 파라미터가 변경될 때마다 실행
  useEffect(() => {
    // 선택된 프레임을 찾아 참조 업데이트
    clicked.current = ref.current.getObjectByName(params?.id);
    setClickedFrameId(params?.id); // 클릭된 프레임의 ID를 업데이트

    if (clicked.current) {
      // 선택된 프레임의 부모 객체의 월드 매트릭스 업데이트
      clicked.current.parent.updateWorldMatrix(true, true);
      // 선택된 프레임의 부모 객체의 로컬 좌표를 월드 좌표로 변환하여 위치 갱신
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      // 선택된 프레임의 부모 객체의 쿼터니언을 가져와서 q에 할당
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      // 선택된 프레임이 없는 경우 초기 위치와 회전 설정
      p.set(0, 0, 5.5);
      q.identity();
    }
  }, [params?.id, p, q]);


  // useFrame을 사용하여 매 프레임마다 카메라의 위치와 회전을 부드럽게 애니메이션화
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  // 프레임들을 렌더링하는 컴포넌트 반환
  return (
    <group
      ref={ref}
      // 클릭 시 해당 아이템으로 이동 또는 이미 선택된 경우 메인 화면으로 이동
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
      onPointerMissed={() => setLocation('/')}>
      {images?.map((props) => <Frame key={props.url} {...props} />)}
      {clickedFrameId && (
        <mesh position={[2, 0, 0]} onClick={() => setLocation('/')}>
          <boxGeometry args={[1, 0.5, 0.2]} />
          <meshStandardMaterial color="blue" />
          <Text anchorX="left" anchorY="top" position={[0.5, 0.25, 0.1]} fontSize={0.1}>
            Back
          </Text>
        </mesh>
      )}
    </group>
  );
}

// 각 프레임을 렌더링하는 컴포넌트
function Frame({ url, c = new THREE.Color(), ...props }) {
  // useRef를 사용하여 이미지와 프레임에 대한 참조 생성
  const image = useRef();
  const frame = useRef();
  // 현재 라우터 파라미터와 호버 상태, 랜덤 값, 이미지 이름 등의 상태 관리를 위해 useState 사용
  const [, params] = useRoute('/item/:id');
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  const isActive = params?.id === name;

  // useCursor를 사용하여 호버 시 커서 상태를 관리
  useCursor(hovered);

  // useFrame을 사용하여 매 프레임마다 이미지와 프레임의 애니메이션 효과 적용
  useFrame((state, dt) => {
    // 클릭된 상태일 때만 애니메이션 효과를 적용
    if (isActive) {
      // 이미지의 확대/축소 애니메이션
      const zoomFactor = 1 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 4; // 조절된 확대 정도
      image.current.material.zoom = zoomFactor;
      // 이미지와 프레임의 크기 조절 및 프레임의 색상 변화
      easing.damp3(image.current.scale, [0.85, 0.9, 1], 0.1, dt);
      easing.dampC(frame.current.material.color, 'white', 0.1, dt);
    } else {
      // 클릭되지 않은 경우 초기 크기로 설정
      image.current.material.zoom = 2;
      easing.damp3(image.current.scale, [0.85, 0.9, 1], 0.1, dt);
      easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt);
    }
  });

  // 각 프레임을 렌더링하는 JSX 반환
  return (
    <group {...props}>
      <mesh
        name={name}
        // 포인터 이벤트 처리
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        {/* 프레임에 대한 재질 설정 */}
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          {/* 프레임 내부에 대한 재질 설정 */}
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        {/* 프레임에 이미지 표시 */}
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      {/* 프레임 아래에 텍스트 표시 */}
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {/* 파일 이름에서 하이픈 제거 후 공백으로 대체하여 표시 */}
        {name.split('-').join(' ')}
      </Text>
    </group>
  );
}

// 갤러리 컴포넌트 내보내기
export default Gallery;