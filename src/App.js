import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

function Model(props) {
  //const ref = useRef();
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  const obj = useLoader(OBJLoader, "/modelv1.obj");
  return (
    <primitive
      rotation={[props.frame * 0.01, props.frame * 0.015, props.frame * 0.02]}
      scale={2}
      object={obj}
    />
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
    <Canvas dpr={0.5} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Model frame={frame} />
      </Suspense>
      <EffectComposer>
        <DepthOfField focusDistance={1} focalLength={0} bokehScale={2} />
      </EffectComposer>
    </Canvas>
  );
}
