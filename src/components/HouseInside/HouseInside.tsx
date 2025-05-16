import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import RoomModel from "./RoomModel";
import { useState } from "react";

const roomsModel = [
  {
    name: "livingroom",
    path: "/images/house1",
    roomLabels: [
      {
        position: [-2, 0, -4.9] as [number, number, number],
        navigateTo: "kitchen",
      },
      {
        position: [-4.9, 0, 2] as [number, number, number],
        navigateTo: "outside",
      },
    ],
  },
  {
    name: "kitchen",
    path: "/images/house2",
    roomLabels: [
      {
        position: [-4.9, 0, -4] as [number, number, number],
        navigateTo: "livingroom",
      },
    ],
  },
];

const HouseInside = () => {
  const [currentRoom, setCurrentRoom] = useState("livingroom");

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
          roomLabels={currentRoomModel.roomLabels}
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
