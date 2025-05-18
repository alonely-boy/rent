// src/components/StreetScene/Road.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";

interface RoadSegment {
  id: string;
  group: string; // Which road it belongs to
  type: number;  // Which tile to use
  position: { x: number; z: number };
  rotationZ?: number;
}

export default function Road() {
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
      {segments.map((seg) => {
        const tile = tiles[seg.type]?.clone();
        if (!tile) return null;
        return (
          <primitive
            key={seg.id}
            object={tile}
            position={[seg.position.x, 0, seg.position.z]}
            rotation={[Math.PI/2, 0, seg.rotationZ ?? Math.PI/2]}
          />
        );
      })}
    </>
  );
}
