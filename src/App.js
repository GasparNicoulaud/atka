import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Mesh } from "three";
import * as THREE from "three";

function Model(props) {
  const obj = useLoader(OBJLoader, "/modelv3-y.obj");
  const colors = useLoader(THREE.TextureLoader, "gradientv3.png");
  const mat = new THREE.MeshLambertMaterial();
  mat.color = new THREE.Color("#28af69");
  mat.opacity = Math.abs(Math.sin(props.frame * 0.09)) * 0.5 + 0.2;
  if (obj) {
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = mat;
      }
    });
  }
  return (
    <>
      <primitive
        rotation={[props.frame * 0.01, props.frame * 0.015, 0]}
        scale={1.5}
        object={obj}
      />
      <mesh
        rotation={[props.frame * 0.01, 1.01 + props.frame * 0.015, 0]}
        scale={1.5}
      >
        <icosahedronGeometry rotation={[Math.PI, 100, 10]} detail={0} />
        <meshPhongMaterial
          color="#d8dfd9"
          opacity={Math.abs(Math.sin(props.frame * 0.03)) * 0.2}
          transparent
          map={colors}
        ></meshPhongMaterial>
      </mesh>
    </>
  );
}

export default function Viewer() {
  const [frame, setFrame] = React.useState(0);
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setFrame((prevCount) => prevCount + deltaTime * 0.01);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  return (
    <Canvas dpr={1} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} />
        <Model frame={frame} />
      </Suspense>
      <EffectComposer autoClear>
        <DepthOfField focusDistance={1} focalLength={0} bokehScale={1} />
      </EffectComposer>
    </Canvas>
  );
}

/*
<EffectComposer>
        <DepthOfField focusDistance={1} focalLength={0} bokehScale={2} />
      </EffectComposer>
      */
