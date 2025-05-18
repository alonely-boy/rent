import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Environment, OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Character } from "../../utils/Character";
import { EnvironmentOutlined } from "@ant-design/icons";
import { color } from "three/tsl";

function SimpleRoom({ playerPosition }: { playerPosition: THREE.Vector3 }) {
  const { scene } = useGLTF("/models/street_new.glb");

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

    console.log("建筑物对象", targets);
    setBuildingObjects(targets);
  }, [scene]);

  // 每帧检测人物与建筑距离
  useFrame(() => {
    if (!playerPosition || buildingObjects.length === 0) return;

    const threshold = 3; // 距离阈值
    let found: THREE.Object3D | null = null;

    for (const obj of buildingObjects) {
      const pos = new THREE.Vector3();
      obj.getWorldPosition(pos);
      // console.log("建筑物位置", pos);
      if (playerPosition.distanceTo(pos) < threshold) {
        found = obj;
        break;
      }
    }

    setTargetBuilding(found);
  });

  // 监听 E 键进入房屋
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "e" && targetBuilding) {
        alert(`Enter Home: ${targetBuilding.name}`);
        // TODO: 替换为跳转逻辑 navigate(`/house/${targetBuilding.name}`)
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [targetBuilding]);

  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} />
      </RigidBody>
      {buildingObjects.map((obj, idx) => {
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);
        worldPos.y += 0;

        const isNear = playerPosition.distanceTo(worldPos) < 3;

        return (
          <group key={idx}>
            <Html
              position={worldPos.toArray()}
              distanceFactor={10}
              style={{ pointerEvents: "none" }}
            >
              <EnvironmentOutlined
                style={{ fontSize: "150px", color: "#3f9cff" }}
              />
            </Html>

            {isNear && (
              <Html
                position={[worldPos.x, worldPos.y + 2, worldPos.z]}
                center
                distanceFactor={8}
              >
                <div
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    fontSize: 20,
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    border: "1px solid #555",
                    whiteSpace: "nowrap",
                  }}
                >
                  Press E to enter:{" "}
                  <b style={{ color: "yellow" }}>{obj.name}</b>
                </div>
              </Html>
            )}
          </group>
        );
      })}
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
