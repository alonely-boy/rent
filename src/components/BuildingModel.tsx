import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Loader } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import "../App.css";
import City from "./MapScene/City";
import City2 from "./MapScene/City2";
import Supermarket from "./MapScene/Supermarket";
import Road from "./MapScene/Road";
import Deco from "./MapScene/Deco";

function Ground() {
  const { scene } = useGLTF("/source/grass_floor.glb");
  const ground = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={ground}
      position={[0, 66, -30]}
      scale={[2.5, 2.5, 2.5]}
    />
  );
}

function Building() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [100, 60, 100], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#a3d5ff");
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Environment preset="forest" />

        <Suspense fallback={null}>
          <Ground />
          <City />
          <City2 />
          <Road />
          <Deco />
          <Supermarket />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <Loader />
    </div>
  );
}

export default Building;
