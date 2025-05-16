import * as THREE from "three";
import { useTexture, Html } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

interface Props {
  path: string;
  roomLabels: { position: [number, number, number]; navigateTo: string }[];
  onClick: (target: string) => void;
}

const RoomModel = ({ path, roomLabels, onClick }: Props) => {
  const meshRef = useRef<Mesh>(null);

  const textures = useTexture([
    `${path}/px.png`,
    `${path}/nx.png`,
    `${path}/py.png`,
    `${path}/ny.png`,
    `${path}/pz.png`,
    `${path}/nz.png`,
  ]);

  return (
    <>
      <mesh ref={meshRef}>
        <boxGeometry args={[10, 10, 10]} />
        {textures.map((item, index) => {
          return (
            <meshStandardMaterial
              key={index}
              attach={`material-${index}`}
              map={item}
              side={THREE.BackSide}
            ></meshStandardMaterial>
          );
        })}
      </mesh>

      {roomLabels?.map((item, index) => {
        return (
          <Html key={index} position={item.position} center>
            <div
              onClick={() => onClick(item.navigateTo)}
              style={{
                background: "rgba(255,255,255,0.5)",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "20px",
                display: "flex",
                color: "red",
                cursor: "pointer",
              }}
            >
              {item.navigateTo}
            </div>
          </Html>
        );
      })}
    </>
  );
};

export default RoomModel;
