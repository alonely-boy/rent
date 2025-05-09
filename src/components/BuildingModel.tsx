import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { Suspense, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import "../App.css";

interface BuildingData {
  id: string;
  position: { x: number; z: number };
  height: number;
  isRenting?: boolean;
}

function BuildingModel({
  id,
  position,
  height,
  isRenting = false,
}: {
  id: string;
  position: [number, number, number];
  height: number;
  isRenting?: boolean;
}) {
  const { scene } = useGLTF("/models/apartment.glb");
  const model = useMemo(() => scene.clone(), [scene]);
  const navigate = useNavigate();
  const scaleY = height / 4;

  return (
    <>
      <primitive
        object={model}
        position={[position[0], 0, position[2]]}
        scale={[1, scaleY, 1]}
      />
      {isRenting && (
        <Html
          position={[position[0], 2 * height + 4, position[2]]}
          distanceFactor={10}
          style={{ pointerEvents: "auto" }}
        >
          <div
            onClick={() => navigate(`/street/${id}`)}
            style={{
              cursor: "pointer",
              animation: "float 1.5s ease-in-out infinite",
            }}
          >
            <EnvironmentOutlined
              style={{ fontSize: "200px", color: "#3f9cff" }}
            />
          </div>
        </Html>
      )}
    </>
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
          id={b.id}
          position={[b.position.x, 0, b.position.z]}
          height={b.height}
          isRenting={b.isRenting}
        />
      ))}
    </>
  );
}

function Building() {
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

export default Building;
