import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RoomModel from "./RoomModel";
import { useState } from "react";
import houseModels from "./InsideModel.json";
import { useParams } from "react-router-dom";

const HouseInside = () => {
  type HouseId = keyof typeof houseModels;

  const { houseId } = useParams();
  const [currentRoom, setCurrentRoom] = useState("living room");

  const key = houseId as HouseId;
  const roomsModel = houseModels[key].rooms;
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
        position: "relative",
        transition: "opacity 0.5s ease",
        opacity: transitioning ? 0 : 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "18px",
          zIndex: 1,
        }}
      >
        {currentRoom}
      </div>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "14px",
          zIndex: 10,
          boxShadow: "0 0 5px rgba(0,0,0,0.2)",
        }}
      >
        {roomsModel.map((room) => (
          <div
            key={room.name}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor:
                room.name === currentRoom ? "#007bff" : "#e0e0e0",
              color: room.name === currentRoom ? "white" : "#333",
              fontWeight: room.name === currentRoom ? "bold" : "normal",
              marginBottom: "4px",
            }}
          >
            {room.name}
          </div>
        ))}
      </div>

      <Canvas camera={{ position: [0, 1, 0], fov: 75 }}>
        <ambientLight intensity={4} />
        <RoomModel
          path={currentRoomModel.path}
          roomLabels={currentRoomModel.roomLabels.map(
            (label: { position: number[]; navigateTo?: string }) => ({
              ...label,
              position: [
                label.position[0] ?? 0,
                label.position[1] ?? 0,
                label.position[2] ?? 0,
              ] as [number, number, number],
              navigateTo: label.navigateTo ?? "",
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
