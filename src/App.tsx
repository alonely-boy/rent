import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect, useState, useMemo } from "react";

// 建筑数据类型
interface BuildingData {
  id: string;
  position: { x: number; z: number };
  height: number;
}

// 加载并克隆 glb 模型
function BuildingModel({ position, height }: { position: [number, number, number]; height: number }) {
  const { scene } = useGLTF("/models/apartment.glb");
  const model = useMemo(() => scene.clone(), [scene]);

  const scaleY = height / 4; // 默认模型高度假设是 4，可根据实际微调

  return (
    <primitive
      object={model}
      position={[position[0], scaleY / 2, position[2]]}
      scale={[1, scaleY, 1]}
    />
  );
}

// 主渲染城市逻辑：从 city-map.json 加载
function City() {
  const [buildings, setBuildings] = useState<BuildingData[]>([]);

  useEffect(() => {
    fetch("/city-map.json")
      .then((res) => res.json())
      .then(setBuildings);
  }, []);

  return (
    <>
      {buildings.map((b) => (
        <BuildingModel
          key={b.id}
          position={[b.position.x, 0, b.position.z]}
          height={b.height}
        />
      ))}
    </>
  );
}

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <City />
        </Suspense>
        <OrbitControls />
        <gridHelper args={[50, 25]} />
      </Canvas>
    </div>
  );
}

export default App;
