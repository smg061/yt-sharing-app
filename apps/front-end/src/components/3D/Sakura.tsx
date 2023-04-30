import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";

import petalTexture from "/assets/petal.png";

interface PetalProps {
  position: [number, number, number];
}

const Petal: React.FC<PetalProps> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const initialPosition = position;
  const speed = useRef<number>(Math.random() + 0.5);
  const phaseOffset = useRef<number>(Math.random() * Math.PI * 2);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    meshRef.current.position.y -= delta * 0.5; // Adjust falling speed
    meshRef.current.position.x =
      initialPosition[0] +
      Math.sin(time * speed.current * 0.5 + phaseOffset.current) * 5; // Adjust waving motion in X direction
    meshRef.current.position.z =
      initialPosition[2] +
      Math.sin(time * speed.current + phaseOffset.current) *2 ; // Adjust waving motion in Z direction

    if (meshRef.current.position.y < -5) {
      meshRef.current.position.y = 5;
    }
  });

  const texture = new TextureLoader().load(petalTexture);

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshBasicMaterial map={texture} transparent={true} />
    </mesh>
  );
};

export default Petal;
