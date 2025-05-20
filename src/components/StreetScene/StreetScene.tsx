import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Environment, OrbitControls, Loader } from "@react-three/drei";
import { Character } from "../../utils/Character";
import { useParams } from "react-router-dom";
import { SimpleRoom } from "./StreetModel";

export function StreetScene() {
  const playerPosRef = useRef(new THREE.Vector3());
  const [cameraFollow, setCameraFollow] = useState(true);
  const { houseId } = useParams();
  const typeModel: Record<string, string> = {
    c223: "type1",
    "e688036a-f93c-47a0-94f8-e83a380f0db0": "type1",
    "734f1f1f-2331-4044-8999-3ee4e329d01f": "type2",
    c386: "type2",
  };
  const model1 = "/models/street_new.glb";
  const model2 = "/models/street_version2.glb";

  useEffect(() => {
    const toggle = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m") {
        setCameraFollow((prev) => !prev);
      }
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  if (typeModel[houseId!] === "type1") {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [0, 3, 10], fov: 60 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]}>
              <SimpleRoom
                playerPosition={playerPosRef.current}
                model={model1}
              />
              <Character
                onPositionUpdate={(v) => playerPosRef.current.copy(v)}
                cameraFollow={cameraFollow}
              />
            </Physics>
            <Environment files="/models/sky.hdr" background />
          </Suspense>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
        <Loader />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: cameraFollow ? "green" : "gray",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          {cameraFollow
            ? "Camera: Follow Mode (M to switch)"
            : "Camera: Free Mode (M to switch)"}
        </div>
      </div>
    );
  } else if (typeModel[houseId!] === "type2") {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          camera={{ position: [0, 3, 10], fov: 60 }}
          onCreated={({ gl }) => {
            gl.setClearColor("#a3d5ff");
          }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <Environment preset="forest" />
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]}>
              <SimpleRoom
                playerPosition={playerPosRef.current}
                model={model2}
              />
              <Character
                onPositionUpdate={(v) => playerPosRef.current.copy(v)}
                cameraFollow={cameraFollow}
              />
            </Physics>
          </Suspense>
          <OrbitControls />
        </Canvas>
        <Loader />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: cameraFollow ? "green" : "gray",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          {cameraFollow
            ? "Camera: Follow Mode (M to switch)"
            : "Camera: Free Mode (M to reset)"}
        </div>
      </div>
    );
  }
}
