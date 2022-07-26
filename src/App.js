import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Mesh } from "three";
import * as THREE from "three";

function Model(props) {
  const obj = useLoader(OBJLoader, "/modelv5.obj");
  const colors = useLoader(THREE.TextureLoader, "gradientv3.png");
  const mat = new THREE.MeshBasicMaterial();
  mat.color = new THREE.Color("#28af69");
  mat.opacity = Math.abs(Math.sin(props.frame * 0.09)) * 0.5 + 0.2;
  if (obj) {
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = mat;
      }
    });
  }
  const rotX = props.mouseX * 0.001 + props.frame * 0.008;
  const rotY = props.mouseY * 0.001 + props.frame * 0.012;
  return (
    <>
      <primitive rotation={[rotX, rotY, 0]} scale={1.5} object={obj} />
      <mesh rotation={[rotX, 1.01 + rotY, 0]} scale={1.5}>
        <icosahedronGeometry rotation={[Math.PI, 100, 10]} detail={0} />
        <meshPhongMaterial
          color="#d8dfd9"
          opacity={Math.abs(Math.sin(props.frame * 0.03)) * 0.05}
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
  const position = useMousePosition();
  return (
    <Canvas dpr={1} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} />
        <Model frame={frame} mouseX={position.x} mouseY={position.y} />
      </Suspense>
      <EffectComposer autoClear>
        <DepthOfField focusDistance={1} focalLength={0} bokehScale={0.4} />
      </EffectComposer>
    </Canvas>
  );
}

/*
<EffectComposer>
        <DepthOfField focusDistance={1} focalLength={0} bokehScale={2} />
      </EffectComposer>
      */

const useMousePosition = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  return position;
};
