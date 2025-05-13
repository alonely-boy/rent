import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import "../App.css";
import City from "./MapScene/City";
import City2 from "./MapScene/City2";
interface BuildingData {
  id: string;
  position: { x: number; z: number };
  height: number;
  isRenting?: boolean;
}

function BuildingModel({
  id,
  position,
  height,
  isRenting = false,
}: {
  id: string;
  position: [number, number, number];
  height: number;
  isRenting?: boolean;
}) {
  const { scene } = useGLTF("/models/apartment.glb");
  const model = useMemo(() => scene.clone(), [scene]);
  const navigate = useNavigate();
  const scaleY = height / 4;

  return (
    <>
      <primitive
        object={model}
        position={[position[0], 0, position[2]]}
        scale={[1, scaleY, 1]}
      />
      {isRenting && (
        <Html
          position={[position[0], 2 * height + 4, position[2]]}
          distanceFactor={10}
          style={{ pointerEvents: "auto" }}
        >
          <div
            onClick={() => navigate(`/street/${id}`)}
            style={{
              cursor: "pointer",
              animation: "float 1.5s ease-in-out infinite",
            }}
          >
            <EnvironmentOutlined
              style={{ fontSize: "200px", color: "#3f9cff" }}
            />
          </div>
        </Html>
      )}
    </>
  );
}

function Building() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [50, 30, 20], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Environment preset="city" />
        <axesHelper args={[10]} />
        <gridHelper args={[100, 50]} />

        <Suspense fallback={null}>
          <City />
          <City2 />
        </Suspense>
        <OrbitControls />
        <gridHelper args={[50, 25]} />
      </Canvas>
    </div>
  );
}

export default Building;
