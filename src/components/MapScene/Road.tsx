// src/components/StreetScene/Road.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

interface RoadSegment {
  id: string;
  group: string; // Which road it belongs to
  type: number; // Which tile to use
  position: { x: number; z: number };
  rotationZ?: number;
  isNear?: boolean;
}

export default function Road() {
  const navigate = useNavigate();
  const { scene } = useGLTF("/models/map/road.glb");
  const [segments, setSegments] = useState<RoadSegment[]>([]);

  useEffect(() => {
    fetch("/road-map.json")
      .then((res) => res.json())
      .then(setSegments);
  }, []);

  const tiles = useMemo(() => {
    const meshes: THREE.Object3D[] = [];
    scene.traverse((child) => {
      if (child.type === "Mesh") {
        meshes.push(child);
      }
    });
    return meshes;
  }, [scene]);

  return (
    <>
      {segments.map((seg, index) => {
        const tile = tiles[seg.type]?.clone();
        if (!tile) return null;

        // 处理材质：设置为绿色或发光
        tile.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = (
              mesh.material as THREE.MeshStandardMaterial
            ).clone();

            if (seg.isNear) {
              material.color.set("#000"); // 变绿色
              material.emissive = new THREE.Color("#00ff00"); // 添加发光
              material.emissiveIntensity = 1.2;
            }

            mesh.material = material;
          }
        });

        return (
          <primitive
            key={`${seg.id}-${index}`}
            object={tile}
            position={[seg.position.x, 0, seg.position.z]}
            rotation={[Math.PI / 2, 0, seg.rotationZ ?? Math.PI / 2]}
          />
        );
      })}
    </>
  );
}
