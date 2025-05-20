import { useGLTF, useAnimations } from "@react-three/drei";
import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Character({
  onPositionUpdate,
  cameraFollow,
}: {
  onPositionUpdate?: (v: THREE.Vector3) => void;
  cameraFollow: boolean;
}) {
  const { scene, animations } = useGLTF("/models/character.glb");
  const { actions } = useAnimations(animations, scene);

  const groupRef = useRef<THREE.Group>(null);
  const rigidRef = useRef<RapierRigidBody>(null);
  const keys = useRef<Record<string, boolean>>({});
  const currentAction = useRef<string | null>(null);
  const { camera } = useThree();

  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();

  useFrame(() => {
    if (rigidRef.current) {
      const pos = rigidRef.current.translation();
      onPositionUpdate?.(new THREE.Vector3(pos.x, pos.y, pos.z));
    }
  });

  useEffect(() => {
    animations.forEach((clip) => {
      clip.tracks = clip.tracks.filter(
        (track) => !track.name.endsWith(".position")
      );
    });

    const handleKeyDown = (e: KeyboardEvent) =>
      (keys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e: KeyboardEvent) =>
      (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [animations]);

  const playAction = (name: string) => {
    if (currentAction.current === name) return;
    if (currentAction.current) actions[currentAction.current]?.fadeOut(0.2);
    const next = actions[name];
    next?.reset().fadeIn(0.2).play();
    next!.loop = THREE.LoopRepeat;
    currentAction.current = name;
  };

  useFrame(() => {
    const speed = keys.current["shift"] ? 5 : 2.5;

    direction.set(0, 0, 0);
    if (keys.current["w"]) direction.z -= 1;
    if (keys.current["s"]) direction.z += 1;
    if (keys.current["a"]) direction.x -= 1;
    if (keys.current["d"]) direction.x += 1;
    direction.normalize();

    if (rigidRef.current && direction.lengthSq() > 0) {
      // 设置线速度
      velocity.copy(direction).multiplyScalar(speed);
      const currentY = rigidRef.current.linvel().y;
      rigidRef.current.setLinvel(
        { x: velocity.x, y: currentY, z: velocity.z },
        true
      );

      // 设置模型朝向
      const angle = Math.atan2(direction.x, direction.z);
      if (groupRef.current) {
        groupRef.current.rotation.y = angle;
      }
    } else {
      // 停止
      rigidRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // 摄像机追踪
    const pos = rigidRef.current?.translation();
    if (pos) {
      if (cameraFollow) {
        const camOffset = new THREE.Vector3(0, 5, 7);
        const camTarget = new THREE.Vector3(pos.x, pos.y, pos.z).add(camOffset);
        camera.position.lerp(camTarget, 0.3);
        camera.lookAt(pos.x, pos.y + 1, pos.z);
      }
    }

    // 动作切换
    if (keys.current[" "]) {
      playAction("Jump");
    } else if (keys.current["shift"] && direction.lengthSq() > 0) {
      playAction("Running");
    } else if (direction.lengthSq() > 0) {
      playAction("Walk");
    } else {
      playAction("Idle");
    }
  });

  return (
    <>
      <RigidBody
        ref={rigidRef}
        type="dynamic"
        mass={1}
        friction={1}
        restitution={0}
        colliders={false}
        enabledRotations={[false, false, false]}
        position={[0, 1, 0]}
      >
        <CapsuleCollider args={[0.4, 1.2]} position={[0, 1.2, 0]} />
        <group ref={groupRef}>
          <primitive object={scene} />
          {/* <mesh>
          <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
          <meshBasicMaterial wireframe color="lime" />
        </mesh> */}
        </group>
      </RigidBody>
    </>
  );
}
