// src/components/BuildingModel.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

interface Props {
  position: [number, number, number];
  scaleY: number; // 控制楼层高度
}

export function BuildingModel({ position, scaleY }: Props) {
  const { scene } = useGLTF("/models/building.glb");
  const model = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={model}
      position={[position[0], scaleY / 2, position[2]]}
      scale={[1, scaleY, 1]} // 只放大高度
    />
  );
}
