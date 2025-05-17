import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import RoomModel from "./RoomModel";
import { useState } from "react";
import houseModels from "./InsideModel.json";

const HouseInside = () => {
  const [currentRoom, setCurrentRoom] = useState("living room");
  const houseId = "house1";
  const roomsModel = houseModels[houseId];
  const currentRoomModel = roomsModel.find((room) => room.name === currentRoom);
  const [transitioning, setTransitioning] = useState(false);

  const handleRoomChange = (target: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(target);
      setTransitioning(false);
    }, 500);
  };

  if (!currentRoomModel) return null;
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        transition: "opacity 0.5s ease",
        opacity: transitioning ? 0 : 1,
      }}
    >
      <Canvas camera={{ position: [0, 1, 0], fov: 75 }}>
        <ambientLight intensity={4} />
        <RoomModel
          path={currentRoomModel.path}
          roomLabels={currentRoomModel.roomLabels.map(
            (label: { position: number[]; navigateTo: string }) => ({
              ...label,
              position: [
                label.position[0] ?? 0,
                label.position[1] ?? 0,
                label.position[2] ?? 0,
              ] as [number, number, number],
            })
          )}
          onClick={handleRoomChange}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          // minDistance={1}
          maxDistance={1}
        />
      </Canvas>
    </div>
  );
};

export default HouseInside;
