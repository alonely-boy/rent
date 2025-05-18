import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect, useState } from "react";
import * as THREE from "three";

interface DecoItem {
  id: string;
  type: number;
  position: { x: number; z: number };
  scale: number;
  rotationY?: number;
}

// 将模型居中到自身包围盒中心
function centerModel(model: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.sub(center);
}

export default function Deco() {
  const { scene: tree1 } = useGLTF("/models/map/Trees.glb");
  const { scene: tree2 } = useGLTF("/models/map/Birch_Trees.glb");
  const { scene: lamp } = useGLTF("/models/map/street_lamp.glb");

  const [decorations, setDecorations] = useState<DecoItem[]>([]);

  useEffect(() => {
    fetch("/deco.json")
      .then((res) => res.json())
      .then(setDecorations);
  }, []);

  const models = useMemo(() => {
    const all = [tree1.clone(), tree2.clone(), lamp.clone()];
    all.forEach((model) => {
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.visible = true;
        }
      });
      centerModel(model); // 关键：让所有模型以中心为原点
    });
    return all;
  }, [tree1, tree2, lamp]);

  return (
    <>
      {decorations.map((item) => {
        const base = models[item.type];
        if (!base) return null;

        const model = base.clone();
        const s = item.scale;
        const ry = item.rotationY ?? 0;

        return (
          <group
            key={item.id}
            position={[item.position.x, item.type===2?item.scale*6*100:item.scale*4, item.position.z]}
            rotation={[0, ry, 0]}
            scale={[s, s, s]}
          >
            <primitive object={model} />
          </group>
        );
      })}
    </>
  );
}
