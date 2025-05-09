// src/pages/StreetScene.tsx
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { PointerLockControls, useGLTF, Environment } from "@react-three/drei";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PlayerControls } from "../../utils/MoveControl";

function StreetModel() {
  const { scene } = useGLTF("/models/street.glb"); // 👉 你可以换成你的街道模型
  return <primitive object={scene} scale={0.1} />;
}
export function StreetScene() {
  const { id } = useParams(); // 当前点击的建筑 ID
  const navigate = useNavigate();

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [navigate]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [5, 1.6, 5], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <StreetModel />
          <Environment preset="city" />
        </Suspense>
        <PlayerControls />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#fff",
          fontSize: "16px",
        }}
      >
        🏠 Street ID: <strong>{id}</strong> <br />
        <small>Click to enter view, press Esc to exit</small>
      </div>
    </div>
  );
}
