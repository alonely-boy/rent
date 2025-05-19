// src/components/StreetScene/City2.tsx
import { useGLTF, Html } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import * as THREE from "three";

interface BuildingData {
  id: string;
  type: number;
  position: { x: number; z: number };
  height: number;
  rotationY?: number;
  isRenting?: boolean;
}

export default function City2() {
  const navigate = useNavigate();
  const { scene } = useGLTF("/models/map/buildings.glb");
  const [buildings, setBuildings] = useState<BuildingData[]>([]);

  useEffect(() => {
    fetch("/city2-map.json")
      .then((res) => res.json())
      .then(setBuildings);
  }, []);

  const buildingModels = useMemo(() => {
    const models: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (
        child.type === "Object3D" &&
        child.name.startsWith("Cube") &&
        child.children.some((c) => c.type === "Mesh")
      ) {
        models.push(child);
      }
    });
    return models;
  }, [scene]);

  return (
    <>
      {buildings.map((b) => {
        const original = buildingModels[b.type];
        const model = original?.clone();
        if (!model || !original) return null;

        // 强制统一旋转角度以补偿导出错误
        model.rotation.x = -Math.PI / 2;

        return (
          <group key={b.id}>
            <primitive
              object={model}
              position={[b.position.x, b.height / 10, b.position.z]}
              scale={[1, b.height / 5, 1]}
            />

            {b.isRenting && (
              <Html
                position={[b.position.x, b.height / 10 + 10, b.position.z]}
                distanceFactor={10}
                style={{ pointerEvents: "auto" }}
              >
                <div
                  onClick={() => navigate(`/street/${b.id}`)}
                  style={{
                    cursor: "pointer",
                    animation: "float 1.5s ease-in-out infinite",
                  }}
                >
                  <div
                    style={{
                      fontSize: "250px",
                      fontWeight: "bold",
                      color: "#000",
                      marginTop: "5px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Click to view
                  </div>
                  <EnvironmentOutlined
                    style={{ fontSize: "900px", color: "#000" }}
                  />
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}
