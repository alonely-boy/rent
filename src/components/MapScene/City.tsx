// src/components/StreetScene/City.tsx
import { useGLTF, Html } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
interface BuildingData {
  id: string;
  type: number;
  position: { x: number; z: number };
  height: number;
  rotationZ?: number;
  isRenting?: boolean;
}

export default function City() {
  const navigate = useNavigate();
  const { scene } = useGLTF("/models/map/100_buildings.glb");
  const [buildings, setBuildings] = useState<BuildingData[]>([]);

  useEffect(() => {
    fetch("/city-map.json")
      .then((res) => res.json())
      .then(setBuildings);
  }, []);

  const buildingModels = useMemo(() => {
    const buildingMap: Record<string, THREE.Group> = {};

    scene.traverse((child) => {
      if (child.type === "Mesh" && child.name.startsWith("Building_")) {
        const key = child.name.split("_").slice(0, 2).join("_"); // e.g. "Building_18"
        if (!buildingMap[key]) {
          buildingMap[key] = new THREE.Group();
        }
        buildingMap[key].add(child.clone());
      }
    });

    const models = Object.values(buildingMap);
    return models;
  }, [scene]);

  return (
    <>
      {buildings.map((b) => {
        const original = buildingModels[b.type];
        const model = original?.clone();
        if (!model || !original) return null;

        // 修正模型导出时 X 轴偏转问题
        model.rotation.x = -Math.PI / 2;

        return (
          <group key={b.id}>
            <primitive
              object={model}
              position={[b.position.x, 0, b.position.z]}
              scale={[b.height / 12, b.height / 12, b.height / 12]}
              rotation={[-Math.PI / 2, 0, b.rotationZ ?? Math.PI / 2]}
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
