import Canvas3D from "@/components/3D/Canvas3D";
import UwuWelcome from "@/components/LandingBanner";

export function Home() {
  return (
    <div className="grid grid-cols-3">
      <Canvas3D
        text={{
          body: "Hewwo",
          title: "Hewwo",
          position: [-1, 1, 1],
          rotation: [0, 0, 0],
        }}
      />
      <UwuWelcome />
      <Canvas3D
        text={{
          body: "owo",
          title: "owo",
          position: [0, 0, 0],
          rotation: [0, 0, 0],
        }}
      />
    </div>
  );
}
