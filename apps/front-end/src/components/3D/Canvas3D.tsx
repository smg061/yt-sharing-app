import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { BufferGeometry, Mesh } from "three";
import {
  OrbitControls,
  PointerLockControls,
  Stars,
  Text3D,
  useGLTF,
} from "@react-three/drei";
import RetroLoader from "../loaders/RetroLoader";
import Petal from "./Sakura";
import { Effects } from "./Effects";

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

type TextProps = {
  text: {
    body: string;
    title: string;
    position: [number, number, number];
    rotation: [number, number, number];
  };
};
export function Canvas3D({
  text = {
    body: "Hello World",
    title: "Hello World",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
}: TextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petals = useMemo(() => {
    return Array.from({ length: 500 }, () => {
      const x = Math.random() * 40 - 20;
      const y = Math.random() * 40 - 20;
      const z = Math.random() * 40 - 20;
      return <Petal position={[x, y, z]} />;
    });
  }, []);

  const forest = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const x = Math.random() * 40 - 20;
      const y = Math.random() * 40 - 20;
      const z = Math.random() * 40 - 20;
      const scale = (Math.random() * 0.05) % 0.4;
      return (
        <LoadModel
          key={i}
          modelPath="/models/lowpoly_tree/scene.gltf"
          rotation={[0, i, 0]}
          position={[i * 10, -2, z]}
          scale={[scale, scale, scale]}
        />
      );
    });
  }, []);
  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, 15] }}
      shadows
      style={{
        position: "absolute",
      }}
    >
      <LoadModel
        modelPath="/models/lowpoly_tree/scene.gltf"
        rotation={[0, 1, 0]}
        position={[-45, -2, -50]}
        scale={[0.05, 0.05, 0.05]}
      />
      <>{forest}</>
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
      <Stars
        radius={100}
        depth={50}
        count={10000}
        factor={4}
        saturation={10}
        fade
        speed={1}
      />
      <ambientLight />
      
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Effects/>
      {/* <RainbowParticles /> */}
      <pointLight position={[10, 10, 10]} />
      <>{petals}</>
    </Canvas>
  );
}

export default function CanvasWithLoading({ text }: TextProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const x = setTimeout(() => {
      setLoading(false);
    }, 1100);
    return () => {
      clearTimeout(x);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen relative flex justify-center items-center">
        <RetroLoader loadingText="Loading..." duration={1}></RetroLoader>
      </div>
    );
  }

  return <Canvas3D text={text} />;
}

export function LoadModel({
  modelPath,
  rotation,
  position,
  scale,
}: {
  modelPath: string;
  rotation?: [number, number, number];
  position?: [number, number, number];
  scale?: [number, number, number];
}) {
  const gltf = useGLTF(modelPath);
  const object = useMemo(() => {
    return gltf.scene.clone();
  }, [gltf.scene]);
  return (
    <primitive
      rotation={rotation}
      position={position}
      scale={scale}
      object={object}
    />
  );
}
