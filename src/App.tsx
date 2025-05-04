import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";

const Building = ({ x, z, height }: { x: number; z: number; height: number }) => (
  <mesh position={[x, height / 2, z]}>
    <boxGeometry args={[1, height, 1]} />
    <meshStandardMaterial color={`hsl(${height * 30}, 70%, 50%)`} />
  </mesh>
);

const City = () => {
  const buildings = [];

  for (let x = -10; x <= 10; x += 2) {
    for (let z = -10; z <= 10; z += 2) {
      const height = Math.random() * 5 + 1;
      buildings.push(<Building key={`${x},${z}`} x={x} z={z} height={height} />);
    }
  }

  return <>{buildings}</>;
};

function App() {
  const [infoVisible, setInfoVisible] = useState(true);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Suspense fallback={null}>
          <City />
        </Suspense>
        <OrbitControls />
        <gridHelper args={[40, 20]} />
      </Canvas>

      {/* UI 面板 */}
      {infoVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            maxWidth: "200px",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <strong>City Info</strong>
          </div>
          <div>Buildings: 121</div>
          <div>Average Height: ~3.5</div>
          <button
            onClick={() => setInfoVisible(false)}
            style={{
              marginTop: "8px",
              padding: "4px 8px",
              backgroundColor: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
