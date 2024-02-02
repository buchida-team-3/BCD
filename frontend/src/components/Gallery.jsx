import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extend, Canvas, useThree, useFrame } from '@react-three/fiber';
import { useCursor, MeshReflectorMaterial, Html, Image, Text, Environment } from '@react-three/drei';
import { useRoute, useLocation } from 'wouter';
import { easing } from 'maath';
import getUuid from 'uuid-by-string';
import './Gallery.css';
const GOLDENRATIO = 1.61803398875

extend({ Html });

function Upload3DButton({ position, onClick }) {
  const ref = useRef();

  // 버튼에 애니메이션 추가하기 위한 ref
  useFrame(() => {
    // 예: Y축을 중심으로 회전하는 애니메이션을 제거하거나 조절
    ref.current.rotation.y += 0.00;
  });

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}>
      <mesh>
        <boxGeometry args={[1, 0.5, 0.1]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>
      <Text
        position={[0, 0, 0.06]} // Adjust text position based on button geometry
        fontSize={0.25}
        color="white" // Text color
        anchorX="center" // Center the text horizontally
        anchorY="middle" // Center the text vertically
      >
        Upload
      </Text>
    </group>
  );
}

function Stitch3DButton({ position, onClick }) {
  const ref = useRef();

  // 버튼에 애니메이션 추가하기 위한 ref
  useFrame((state, delta) => {
    // 예: Z축을 중심으로 회전하는 애니메이션을 추가
    ref.current.rotation.z += 0.00;
  });

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}>
      <mesh>
        <boxGeometry args={[1, 0.5, 0.1]} />
        <meshStandardMaterial color="limegreen" />
      </mesh>
      <Text
        position={[0, 0, 0.1]} // Adjust text position based on button geometry
        fontSize={0.2}
        color="white" // Text color
        anchorX="center" // Center the text horizontally
        anchorY="middle" // Center the text vertically
      >
        Stitch
      </Text>
    </group>
  );
}


function BackButton({ position, onClick }) {
  const ref = useRef();

  // 버튼에 애니메이션 추가하기 위한 ref
  useFrame((state, delta) => {
    // 예: Z축을 중심으로 회전하는 애니메이션을 추가
    ref.current.rotation.z += 0.00;
  });

  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}>
      <mesh>
        <boxGeometry args={[1, 0.5, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Text
        position={[0, 0, 0.1]} // Adjust text position based on button geometry
        fontSize={0.2}
        color="white" // Text color
        anchorX="center" // Center the text horizontally
        anchorY="middle" // Center the text vertically
      >
        Back
      </Text>
    </group>
  );
}

// 갤러리 컴포넌트
const Gallery = () => {
  let responseData;
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  // useRef를 사용해서 파일 입력 요소를 참조
  const fileInputRef = useRef(null);
  
  const uploadFiles = async () => {
    const fileInput = fileInputRef.current;
    // 이벤트 리스너를 추가/제거해서 중복 이벤트 리스너 등록을 방지
    
    if (fileInput) {
      fileInput.setAttribute('multiple', true);
      fileInput.click();
    }
  };
  
  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      const selectedFiles = fileInput.files;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        
        // 선택한 모든 파일을 FormData에 추가
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('files', selectedFiles[i]);
        }
        
        try {
          const response = await fetch('http://localhost:8000/group/album/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              // 추가된 부분: 인증 토큰을 헤더에 포함시킵니다.
            },
            body: formData
          });
          
          if (response.ok) {
            responseData = await response.json();
            if ( responseData && Array.isArray(responseData) ) {
              const newImages = responseData.map((data, index) => ({

                position: [index % 3, Math.floor(index / 3), 0],
                  rotation: [0, 0, 0],
                  url: data.filename.replace(/\\/g, '/').replace('../frontend/public/',''),
                }));

                const updatedImages = [...uploadedImages, ...newImages];
                setUploadedImages((prevImages) => [...prevImages, ...newImages]);

                localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
              }
              console.log(responseData.data);
              console.log(uploadedImages);
            alert('파일 업로드 성공!');
          } else {
            alert('파일 업로드 실패.');
          }
        } catch (error) {
          console.error('파일 업로드 중 오류 발생:', error);
        }
      }
    }
  };
  // 페이지 로드 시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const storedImages = localStorage.getItem('uploadedImages');
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
    }
  }, []);


  const handleStitchButtonClick = () => {
    console.log('Stitch Button clicked!');
  };
  
  const handleBackButtonClick = () => {
    navigate('/aIbum');
  };
  const InputBox = () => {
    const { size } = useThree();
  
    return (
      <Html>
        <input type="file" id="fileInput" multiple style={{ display: 'none' }} ref={fileInputRef} onChange={handleUpload} />
      </Html>
    );
  };
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
      {/* 배경 색상 설정 */}
      <color attach="background" args={['#191920']} />
      {/* 안개 설정 */}
      <fog attach="fog" args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        {/* 프레임과 반사 효과를 가진 이미지 렌더링 */}
        <Frames images={uploadedImages} />
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
      {/* 버튼 추가 */}
      <InputBox />
      <Upload3DButton position={[-3, 1.5, 2.9]} onClick={uploadFiles} />
      <InputBox />
      <Upload3DButton position={[0, 1.5, 2.9]} onClick={uploadFiles}/>
      <InputBox />
      <Upload3DButton position={[3, 1.5, 2.9]} onClick={uploadFiles} />
u      {/* Stitch3DButton 추가 */}
      <Stitch3DButton position={[-3, -0.3, 2.9]} onClick={handleStitchButtonClick} />
      <Stitch3DButton position={[3, -0.3, 2.9]} onClick={handleStitchButtonClick} />
      <BackButton position={[-0.8, -0.3, 2.9]} onClick={handleBackButtonClick} />
    </Canvas>
  )
}

// 갤러리 컴포넌트에서 사용되는 Frames 컴포넌트
function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {

  // useRef를 통해 프레임과 클릭된 아이템에 대한 참조 생성
  const ref = useRef();
  const clicked = useRef();

  // 현재 라우터 파라미터와 로케이션을 가져오기 위해 useRoute와 useLocation 훅 사용
  const [, params] = useRoute('/item/:id');
  const [, setLocation] = useLocation();

  // useEffect를 사용하여 라우터 파라미터가 변경될 때마다 실행
  useEffect(() => {
    // 선택된 프레임을 찾아 참조 업데이트
    clicked.current = ref.current.getObjectByName(params?.id);
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
  }, [params?.id]);

  // useFrame을 사용하여 매 프레임마다 카메라의 위치와 회전을 부드럽게 애니메이션화
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  // 프레임들을 렌더링하는 컴포넌트 반환
  return (
    <group>
      ref={ref}
      // 클릭 시 해당 아이템으로 이동 또는 이미 선택된 경우 메인 화면으로 이동
      onDoubleClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
      {/* onPointerMissed={() => setLocation('/')}> */}
      {images?.map((props) => <Frame key={props.url} {...props} />)}
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

  // useThree 훅을 사용하여 state 객체를 가져옴
  const { camera, mouse } = useThree();

  // 드래그 이벤트 처리를 위한 상태와 함수 정의
  const [dragging, setDragging] = useState(false);
  const [mouseStart, setMouseStart] = useState({ x: 0, y: 0 });
  const [frameStart, setFrameStart] = useState({ x: 0, y: 0 });

  // useFrame을 사용하여 매 프레임마다 이미지와 프레임의 애니메이션 효과 적용
  useFrame((state, dt) => {
    // 이미지의 확대/축소 애니메이션
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    // 이미지와 프레임의 크기 조절 및 프레임의 색상 변화
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt);
    easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt);

    // 드래그 중일 때 프레임 이동 처리
    if (dragging) {
      const { x: mouseX, y: mouseY } = mouse;
      const deltaX = (mouseX - mouseStart.x) * 5;
      const deltaY = (mouseY - mouseStart.y) * 5; // 상하 마우스 움직임 반대로 처리
      frame.current.position.x = frameStart.x + deltaX;
      frame.current.position.y = frameStart.y + deltaY; // 상하 마우스 움직임 반대로 처리
    }
  });

  // 프레임 클릭 시 선택된 아이템으로 이동 또는 이미 선택된 경우 메인 화면으로 이동
  const handleFrameClick = (e) => {
    e.stopPropagation();
    if (!dragging) {
      hover(true);
      // setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name);
    }
  };

  // 드래그 시작 이벤트 처리
  const handleDragStart = (e) => {
    e.stopPropagation();
    setDragging(true);
    setMouseStart({ x: mouse.x, y: mouse.y });
    setFrameStart({ x: frame.current.position.x, y: frame.current.position.y });
  };

  // 드래그 종료 이벤트 처리
  const handleDragEnd = () => {
    setDragging(false);
  };

  // 각 프레임을 렌더링하는 JSX 반환
  return (
    <group
      {...props}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}
      onClick={handleFrameClick}
      onPointerMissed={() => {} /* setLocation('/') */}>
      {/* 프레임 아래에 텍스트 표시 */}
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {/* 파일 이름에서 하이픈 제거 후 공백으로 대체하여 표시 */}
        {name.split('-').join(' ')}
      </Text>
      <mesh
        name={name}
        // 프레임에 대한 재질 설정
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
        ref={frame}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          {/* 프레임 내부에 대한 재질 설정 */}
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        {/* 프레임에 이미지 표시 */}
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
    </group>
  );
}

// 갤러리 컴포넌트 내보내기
export default Gallery;


