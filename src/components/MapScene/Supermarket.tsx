// src/components/StreetScene/Market.tsx
import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";

interface MarketData {
  id: string;
  type: number; // 0: supermarket.glb, 1: supermarket2.glb
  position: { x: number; z: number };
  scale?: number;
  rotationY?: number; // Y-axis rotation in radians
}

export default function Market() {
  const { scene: s1 } = useGLTF("/models/map/supermarket.glb");
  const { scene: s2 } = useGLTF("/models/map/supermarket2.glb");
  const [markets, setMarkets] = useState<MarketData[]>([]);

  useEffect(() => {
    fetch("/market.json")
      .then((res) => res.json())
      .then(setMarkets);
  }, []);

  const models = useMemo(() => {
    const m1 = s1.clone();
    const m2 = s2.clone();
    return [m1, m2];
  }, [s1, s2]);

  return (
    <>
      {markets.map((m) => {
        const model = models[m.type]?.clone();
        if (!model) return null;
        return (
          <primitive
            key={m.id}
            object={model}
            position={[m.position.x, 0, m.position.z]}
            scale={[m.scale ?? 1, m.scale ?? 1, m.scale ?? 1]}
            rotation={[0, m.rotationY ?? 0, 0]}
          />
        );
      })}
    </>
  );
}
