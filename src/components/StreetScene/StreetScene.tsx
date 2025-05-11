import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, useRapier } from "@react-three/rapier";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { Character } from "../../utils/Character";

function SimpleRoom() {
  return (
    <>
      {/* 地板 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[20, 1, 20]} />
          <meshStandardMaterial color="#666" wireframe />
        </mesh>
      </RigidBody>

      {/* 四面墙 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 2, -10]}>
          <boxGeometry args={[20, 4, 1]} />
          <meshStandardMaterial color="#999" wireframe />
        </mesh>
        <mesh position={[0, 2, 10]}>
          <boxGeometry args={[20, 4, 1]} />
          <meshStandardMaterial color="#999" wireframe />
        </mesh>
        <mesh position={[-10, 2, 0]}>
          <boxGeometry args={[1, 4, 20]} />
          <meshStandardMaterial color="#999" wireframe />
        </mesh>
        <mesh position={[10, 2, 0]}>
          <boxGeometry args={[1, 4, 20]} />
          <meshStandardMaterial color="#999" wireframe />
        </mesh>
      </RigidBody>
    </>
  );
}

export function StreetScene() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 3, 10], fov: 60 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <SimpleRoom />
            <Character />
          </Physics>
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
