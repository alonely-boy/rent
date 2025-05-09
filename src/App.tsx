import { Routes, Route } from "react-router-dom";
import Building from "./components/BuildingModel";
import { StreetScene } from "./components/StreetScene/StreetScene";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Building />} />
      <Route path="/street/:id" element={<StreetScene />} />
    </Routes>
  );
}

export default App;
