import { MeshProps, extend, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Mesh, SphereGeometry, Vector3 } from "three";

extend({ SphereGeometry });
const Particle: React.FC<
  MeshProps & {
    color?: string;
    position?: Vector3;
  }
> = (props) => {
  const meshRef = useRef<Mesh>(null);
  const initialPosition = useRef<Vector3>(
    props.position?.clone() ?? new Vector3(0, 0, 0)
  );
  const speed = useRef<number>(Math.random() + 0.5);
  const phaseOffset = useRef<number>(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();

      meshRef.current.position.x =
        initialPosition.current.x +
        Math.sin(time * speed.current + phaseOffset.current) * 5;
      meshRef.current.position.y =
        initialPosition.current.y +
        Math.sin(time * speed.current * 0.5 + phaseOffset.current) * 5;
      meshRef.current.position.z =
        initialPosition.current.z +
        Math.sin(time * speed.current + phaseOffset.current) * 5;
    }
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={props.scale || new Vector3(0.1, 0.1, 0.1)}
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color={props.color || "white"} />
    </mesh>
  );
};

export default Particle;
