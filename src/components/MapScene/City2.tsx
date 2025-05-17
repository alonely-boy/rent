// src/components/StreetScene/City2.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";

interface BuildingData {
  id: string;
  type: number;
  position: { x: number; z: number };
  height: number;
  rotationY?: number;
  isRenting?: boolean;
}

export default function City2() {
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
    // console.log("[City2] Filtered building count:", models.length);
    // models.forEach((m, i) => {
      // console.log(`[City2] Building[${i}]:`, m.name, m.type);
    // });
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
          <primitive
            key={b.id}
            object={model}
            position={[b.position.x, 0, b.position.z]}
            scale={[1, b.height / 5, 1]}
          />
        );
      })}
    </>
  );
}
