import { RigidBody } from "@react-three/rapier";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useGLTF, Html } from "@react-three/drei";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useFrame } from "@react-three/fiber";

export function SimpleRoom({
  playerPosition,
  model,
}: {
  playerPosition: THREE.Vector3;
  model: string;
}) {
  const { scene } = useGLTF(model);

  const navigate = useNavigate();

  const [buildingObjects, setBuildingObjects] = useState<THREE.Object3D[]>([]);
  const [targetBuilding, setTargetBuilding] = useState<THREE.Object3D | null>(
    null
  );
  const isRenting = [
    "building6",
    "building3",
    "building5",
    "building_supermarket",
  ];

  useEffect(() => {
    const targets: THREE.Object3D[] = [];

    scene.traverse((obj) => {
      if (obj.name.includes("building")) {
        targets.push(obj);
      }
    });

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
        // TODO: 替换为跳转逻辑
        navigate(`/insideHouse/${targetBuilding.name}`);
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
        if (!isRenting.includes(obj.name)) return null;
        const worldPos = new THREE.Vector3();
        obj.getWorldPosition(worldPos);

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
