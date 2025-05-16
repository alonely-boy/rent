import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Environment, OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Character } from "../../utils/Character";
import { EnvironmentOutlined } from "@ant-design/icons";

function SimpleRoom({ playerPosition }: { playerPosition: THREE.Vector3 }) {
  const { scene } = useGLTF("/models/house.glb");

  const [buildingObjects, setBuildingObjects] = useState<THREE.Object3D[]>([]);
  const [targetBuilding, setTargetBuilding] = useState<THREE.Object3D | null>(
    null
  );

  useEffect(() => {
    const targets: THREE.Object3D[] = [];

    scene.traverse((obj) => {
      if (obj.name.includes("building")) {
        targets.push(obj);
      }
    });
    console.log(targets);
    setBuildingObjects(targets);
  }, [scene]);

  // 每帧检测人物与建筑距离
  useFrame(() => {
    if (!playerPosition || buildingObjects.length === 0) return;

    const threshold = 5; // 距离阈值
    let found: THREE.Object3D | null = null;

    for (const obj of buildingObjects) {
      const pos = new THREE.Vector3();
      obj.getWorldPosition(pos);
      if (playerPosition.distanceTo(pos) < threshold) {
        found = obj;
        break;
      }
    }

    setTargetBuilding(found);
  });

  console.log(targetBuilding);
  // 监听 E 键进入房屋
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && targetBuilding) {
        alert(`🏠 进入房屋: ${targetBuilding.name}`);
        // TODO: 替换为跳转逻辑 navigate(`/house/${targetBuilding.name}`)
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [targetBuilding]);

  const BuildingHint = ({ position }: { position: THREE.Vector3 }) => {
    const pos = position.clone();
    pos.y += 2;

    return (
      <Html position={pos.toArray()} center>
        <div
          style={{
            padding: 6,
            borderRadius: 4,
            fontSize: 14,
            border: "1px solid #ccc",
          }}
        >
          按 <kbd>E</kbd> 进入房屋
        </div>
      </Html>
    );
  };

  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} />
      </RigidBody>
      {buildingObjects.map((obj, idx) => {
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);
        worldPos.y += 0; // 标签位置略高于建筑

        return (
          <Html
            key={idx}
            position={worldPos.toArray()}
            distanceFactor={10}
            style={{
              pointerEvents: "none",
            }}
          >
            <EnvironmentOutlined
              style={{ fontSize: "200px", color: "#3f9cff" }}
            />
          </Html>
        );
      })}
      {targetBuilding && <BuildingHint position={playerPosition} />}
    </>
  );
}

export function StreetScene() {
  const playerPosRef = useRef(new THREE.Vector3());
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 3, 10], fov: 60 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Physics gravity={[0, -9.81, 0]}>
            <SimpleRoom playerPosition={playerPosRef.current} />
            <Character onPositionUpdate={(v) => playerPosRef.current.copy(v)} />
          </Physics>
          <Environment files="/models/sky.hdr" background />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
