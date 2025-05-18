// src/components/StreetScene/City.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";
import * as THREE from "three";
interface BuildingData {
  id: string;
  type: number;
  position: { x: number; z: number };
  height: number;
  rotationZ?: number;
  isRenting?: boolean;
}

export default function City() {
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
    console.log("[City] Extracted grouped buildings:", models.length);
    models.forEach((m, i) => {
      console.log(`[City] Group[${i}]:`, m.name);
    });
    console.log(buildingMap)
    return models;
  }, [scene]);

  return (
    <>
      {console.log(buildingModels)}
      {buildings.map((b) => {
        const original = buildingModels[b.type];
        const model = original?.clone();
        if (!model || !original) return null;

        // 修正模型导出时 X 轴偏转问题
        model.rotation.x = -Math.PI / 2;

        return (
          <primitive
            key={b.id}
            object={model}
            position={[b.position.x, 0, b.position.z]}
            scale={[b.height/12, b.height / 12, b.height / 12]}
            rotation={[-Math.PI/2, 0, b.rotationZ ?? Math.PI/2]}
          />
        );
      })}
    </>
  );
}
