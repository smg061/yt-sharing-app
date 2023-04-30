import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {  ConeGeometry, SphereGeometry, MeshStandardMaterial, type Group } from "three";

export const IslandModel = () => {
  const islandRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (islandRef.current) {
      islandRef.current.rotation.y += delta / 2;
      islandRef.current.position.y +=
        Math.sin(state.clock.getElapsedTime()) * 0.01;
    }
  });

  return (
    <group ref={islandRef}>
      <mesh
        position={[0, -1, 0]}
        geometry={new ConeGeometry(1, 2, 32)}
        material={new MeshStandardMaterial({ color: "white" })}
      />
      <mesh
        position={[0, 0, 0]}
        geometry={new SphereGeometry(1.2, 32, 32)}
        material={new MeshStandardMaterial({ color: "white" })}
      />
    </group>
  );
};