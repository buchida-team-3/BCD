import * as THREE from "three";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { React, Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, Image as ImageImpl, OrbitControls } from "@react-three/drei";
import { ScrollControls, Scroll, useScroll } from "./LabelScrollControls";
import { useImageData } from "./ImageContext";

import bgImage from "./content/background.jpg";

import "react-visual-grid/dist/react-visual-grid.css";
import { Grid } from "react-visual-grid";

export default function LabelContent({ filterLabel }) {
  // imageData: 이미지 데이터 자체, setImageData: 이미지 데이터를 변경하는 함수
  const { imageData, setImageData } = useImageData(); // Context API 사용을 위해 추가 -> 여기에서 이미 imageData를 사용할 준비가 됨
  const [imageGroups, setImageGroups] = useState([]);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // filterLabel = all -> 정렬된 이미지 보임, filterLabel = Filtering -> 전체 이미지 보임
  console.log("filterLabel 변경:", filterLabel);
  useEffect(() => {
    // 이미지 데이터가 비어있고 요청이 시도되지 않았거나, 데이터가 있는 경우에만 요청
    if (!fetchAttempted || (fetchAttempted && imageData.length > 0)) {
      const fetchImages = async () => {
        // filterLabel 상태에 따라 로직 변경
        const endpoint =
          filterLabel === "Filtering" ? "/api/all" : "/api/filter";
        try {
          const response = await axios.get(`http://localhost:8000${endpoint}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              Label: filterLabel,
            },
          });

          // response.data(=imageData): image의 모든 정보를 담고 있음
          // 예시:
          // {
          // class_name: "['person']",
          // id: 114,
          // image_edited: false,
          // image_lable_rgb: 2,
          // image_meta: "('2023:04:09 10:41:58', 37.513930555555554, 127.10469166666667)",
          // image_name: "IMG_2206.jpeg",
          // image_path: "https://jungle-buchida-s3.s3.ap-northeast-2.amazonaws.com/img_20/IMG_2206.jpeg",
          // user_id: 8
          // }

          // Context API: 이미지 데이터를 전역 상태로 관리
          setImageData(response.data);
          console.log(`imageData : ${imageData}`);

          // 이미지 3장씩 그룹화, 전역으로 관리되는 이미지 데이터를 사용
          const image_path = response.data.map((image) => image.image_path);
          const formattedGroups = image_path
            .map((_, index, array) =>
              index % 3 === 0 ? array.slice(index, index + 3) : null
            )
            .filter(Boolean);
        } catch (error) {
          console.error("Failed to fetch images:", error);
          window.location.href = "/loginandsignup";
        }
      };
      console.log("LabelContent.jsx: imageData 로드 중...");

      // 이미 로드된 이미지 데이터 가져오기
      // 이미지의 캐시 여부 확인
      if (imageData.length === 0) {
        console.log("LabelContent.jsx: 이미지 데이터가 메모리에 없음");
        fetchImages();
        setFetchAttempted(true); // 무한 루프 방지
      } else {
        console.log("LabelContent.jsx: 이미지 데이터가 메모리에 있음");
      }
    }

    // console.log("imageData:", imageData);
    // imageData.map((image) => console.log(image.image_path));
  }, [filterLabel, setImageData, imageData]);

  // const images = Array.from({ length: 50 }, (_, i) => ({
  //   src: `https://picsum.photos/id/${Math.round(Math.random() * 110)}/800/600`,
  //   alt: `Image ${i + 1}`,
  // }));

  const images = imageData.map((image, index) => ({
    src: image.image_path,
    alt: `Image ${index + 1}`,
  }));

  return (
    <>
      <div className="grid-container">
        <Grid images={images} width={1400} height={800} />
      </div>
    </>
  );
}
