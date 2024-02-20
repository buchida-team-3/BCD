import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, Image as ImageImpl } from "@react-three/drei";
import { ScrollControls, Scroll, useScroll } from "./LabelScrollControls";

import Navbar from "./Navbar";
import LabelOverlay from "./LabelOverlay";
// import LabelContent from "./LabelContent";

import LabelContent2 from "./LabelContent2";

import "./LabelPage.css";
import { AlbumListPage2 } from "./AlbumListPage2";

import { AlbumListProvider } from './AlbumListContext';

import AlbumListOverlay2 from './AlbumListOverlay2.jsx'
import AlbumListCard from './AlbumListCard.jsx'
import AlbumListRig from './AlbumListRig.jsx'
import AlbumListCarousel from './AlbumListCarousel.jsx'
import AlbumListContent2 from './AlbumListContent2.jsx'

function LabelPage() {
  const [filterLabel, setFilterLabel] = useState("Filtering");

  const toggleFilterLabel = () => {
    setFilterLabel((currentLabel) =>
      currentLabel === "Filtering" ? "All" : "Filtering"
    );
  };

  return (
  
    <AlbumListProvider>
      <Navbar />
      {/* <LabelContent filterLabel={filterLabel} /> */}
      {/* <LabelContent2 filterLabel={filterLabel} /> */}
      <AlbumListPage2 />
      {/* <LabelOverlay
        onToggleFilterLabel={toggleFilterLabel}
        filterLabel={filterLabel}
      /> */}
    </AlbumListProvider>
      
   
  );
}

export default LabelPage;
