import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Shape, ExtrudeGeometry } from "three";

const Heart: React.FC = (
  props: JSX.IntrinsicElements["mesh"] & {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  }
) => {
  const { scale } = props;
  const shape = useMemo(() => new Shape(), []);

  // Define heart shape points
  shape.moveTo(25, 25);
  shape.bezierCurveTo(25, 25, 20, 0, 0, 0);
  shape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  shape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  shape.bezierCurveTo(60, 77, 80, 55, 80, 35);
  shape.bezierCurveTo(80, 35, 80, 0, 50, 0);
  shape.bezierCurveTo(35, 0, 25, 25, 25, 25);

  // Extrude the shape
  const geometry = useMemo(
    () => new ExtrudeGeometry(shape, { depth: 10, bevelEnabled: false }),
    []
  );

  return (
    <mesh
      scale={scale ?? [0.01, 0.01, 0.01]}
      position={props.position ?? [0, 0, 0]}
      rotation={props.rotation ?? [0, 0, 3.2]}
      geometry={geometry}
    >
      <meshStandardMaterial color={"hotpink"} />
    </mesh>
  );
};
export function SpinningHeart() {
  const heartRef = useRef<any>();
  const [speed, setSpeed] = useState(0.0025);

  useFrame(() => {
    if (heartRef.current) {
      heartRef.current.rotation.y += speed;
    }
  });

  useEffect(() => {
    const increaseSpeed = () => setSpeed((prevSpeed) => prevSpeed + 0.001);
    const interval = setInterval(increaseSpeed, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={heartRef}>
      <Heart />
    </group>
  );
}
export default Heart;
