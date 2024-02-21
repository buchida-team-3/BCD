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

import bgImage from "./content/background.jpg";

function LabelPage2() {
  const [filterLabel, setFilterLabel] = useState("Filtering");

  const toggleFilterLabel = () => {
    setFilterLabel((currentLabel) =>
      currentLabel === "Filtering" ? "All" : "Filtering"
    );
  };

  return (
    <div className="label-page-container">
      <Navbar />
      {/* <LabelContent filterLabel={filterLabel} /> */}
      <LabelContent2 filterLabel={filterLabel} />
      <LabelOverlay
        onToggleFilterLabel={toggleFilterLabel}
        filterLabel={filterLabel}
      />
    </div>
  );
}

export default LabelPage2;
