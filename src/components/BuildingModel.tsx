import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import "../App.css";
import City from "./MapScene/City";
import City2 from "./MapScene/City2";
import Supermarket from "./MapScene/Supermarket";
import Road from "./MapScene/Road";
import Deco from "./MapScene/Deco";
import { Loader } from "../components/StreetScene/Loader";
interface BuildingData {
  id: string;
  position: { x: number; z: number };
  height: number;
  isRenting?: boolean;
}

function Ground() {
  const { scene } = useGLTF("/source/grass_floor.glb");
  const ground = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={ground}
      position={[0, 66, -30]} // 微微低于城市底部，避免 z-fighting
      scale={[2.5, 2.5, 2.5]} // 根据你的城市大小调节
    />
  );
}

function Building() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Loader />
      <Canvas
        camera={{ position: [100, 60, 100], fov: 50 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#a3d5ff");
        }}
      >
        <ambientLight intensity={0.6} />
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
    </div>
  );
}

export default Building;
