import React, { useMemo } from "react";
import { Vector3 } from "three";
import Particle from "./Particle";
import { PointLight } from "three";
import { extend } from "@react-three/fiber";

extend({ PointLight });
const RainbowParticles: React.FC = () => {
  const particleColors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];

  const particles = useMemo(() => {
    const temp: JSX.Element[] = [];
    const particleCount = 1000;

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 40 - 20;
      const y = Math.random() * 40 - 20;
      const z = Math.random() * 40 - 20;

      temp.push(
        <Particle
          key={i}
          position={new Vector3(x, y, z)}
          color={
            particleColors[Math.floor(Math.random() * particleColors.length)]
          }
        />
      );
    }
    return temp;
  }, [particleColors]);

  return <>{particles}</>;
};

export default RainbowParticles;
