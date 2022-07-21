import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import Model from "./Model";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";

export default function Viewer() {
  return (
    <Canvas shadows dpr={0.2} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Model />
        <EffectComposer>
          <DepthOfField focusDistance={1} focalLength={1} bokehScale={1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
