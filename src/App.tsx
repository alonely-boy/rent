import { Routes, Route } from "react-router-dom";
import Building from "./components/BuildingModel";
import { StreetScene } from "./components/StreetScene/StreetScene";
import HouseInside from "./components/HouseInside/HouseInside";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Building />} />
      <Route path="/street" element={<StreetScene />} />
      <Route path="/insideHouse/:houseId" element={<HouseInside />} />
    </Routes>
  );
}

export default App;
