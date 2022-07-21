import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

function Model() {
  const ref = useRef();
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  const obj = useLoader(OBJLoader, "/modelv1.obj");
  return <primitive ref={ref} object={obj} />;
}

export default function Viewer() {
  return (
    <Canvas dpr={0.5} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <EffectComposer>
        <DepthOfField focusDistance={1} focalLength={1} bokehScale={1} />
      </EffectComposer>
    </Canvas>
  );
}
