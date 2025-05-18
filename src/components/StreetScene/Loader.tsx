import { useProgress } from "@react-three/drei";
import "./loader.css";

export function Loader() {
  const { progress, active } = useProgress();
  if (!active) return null;

  return (
    <div className="loader-screen">
      <div className="spinner" />
      <div className="progress-text">{Math.floor(progress)}%</div>
    </div>
  );
}
