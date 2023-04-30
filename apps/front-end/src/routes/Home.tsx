import RetroButton from "@/components/Button/RetroButton";
import UwuWelcome from "@/components/LandingBanner";
import RetroLoader from "@/components/loaders/RetroLoader";
import { WithSuspense, WithSuspenseHOC } from "@/utils/WithSuspense";

import { lazy, useState } from "react";
const Canvas3D = lazy(() => import("@/components/3D/Canvas3D"));
import {} from "lucide-react";
const CanvasWithSuspense = WithSuspenseHOC(Canvas3D);

export function Home() {
  const [zIndex, setZIndex] = useState(0);
  return (
    <div className="relative ">
      {/** This is all background stuff */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <RetroLoader
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          loadingText=""
          duration={0}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-75"></div>
      </div>

      <div className="col-span-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 h-full  z-10">
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-auto"
          style={{
            zIndex: zIndex,
          }}
        >
          <CanvasWithSuspense
            text={{
              body: "Hello World",
              title: "Hello World",
              position: [0, 0, 0],
              rotation: [0, 0, 0],
            }}
          />
        </div>
        <div className="">
          <RetroButton
            text="Awesome 3D graphics?? 🌈✨"
            className="relative z-10"
            onClick={() => setZIndex(zIndex === 0 ? 1 : 0)}
          />
          <UwuWelcome />
        </div>
      </div>
    </div>
  );
}
