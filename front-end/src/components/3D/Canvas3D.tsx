import { useRef, useState } from "react";
import {
  Canvas,
  Object3DNode,
  ThreeElements,
  useFrame,
} from "@react-three/fiber";
import { BufferGeometry, Mesh } from "three";
import { OrbitControls, Text3D } from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import { extend } from "@react-three/fiber";

const fontLoader = new FontLoader().load(
  "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
);

extend({ TextGeometry });
declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

function Box(props: { position?: [number, number, number] }) {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh<BufferGeometry> | null>(null);
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function Canvas3D({
  text = {
    body: "Hello World",
    title: "Hello World",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
}: {
  text: {
    body: string;
    title: string;
    position: [number, number, number];
    rotation: [number, number, number];
  };
}) {
  return (
    <Canvas>
      <Text3D
        font={
          "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
        }
        {...text}
      >
        {text.body}
        <meshNormalMaterial />
      </Text3D>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
      />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}

function ThreeDText(props: { text: string }) {
  return (
    <Text3D
      font={
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
      }
      position={[0, 1, 0]}
      rotation={[0, -1, 0]}
    >
      {props.text}
      <meshNormalMaterial />
    </Text3D>
  );
}
