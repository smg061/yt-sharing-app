import RetroButton from "@/components/Button/RetroButton";
import UwuWelcome from "@/components/LandingBanner";
import RetroLoader from "@/components/loaders/RetroLoader";
import { WithSuspense, WithSuspenseHOC } from "@/utils/WithSuspense";

import { lazy, useState } from "react";
const Canvas3D = lazy(() => import("@/components/3D/Canvas3D"));
import {} from "lucide-react";
const CanvasWithSuspense = WithSuspenseHOC(Canvas3D);

function BlueBar() {
  return (
    <div
      className={"flex flex-col items-center retro-loader-font"}
      style={{
        fontFamily: "Press Start 2P, cursive",
        fontSize: "1.5rem",
      }}
    >
      <div className="mb-4"></div>
      <div className="relative w-full h-8 bg-gray-300 border-2 border-black">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-width duration-500 ease-in"
          style={{ width: `${100}%` }}
        ></div>
      </div>
      <div className="absolute  top-2 terminal-background h-12 w-full"></div>
    </div>
  );
}
export function Home() {
  const [zIndex, setZIndex] = useState(0);
  return (
    <div className="relative ">
      {/** This is all background stuff */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* <div
          className={"flex flex-col items-center retro-loader-font"}
          style={{
            fontFamily: "Press Start 2P, cursive",
            fontSize: "1.5rem",
          }}
        >
          <div className="mb-4"></div>
          <div className="relative w-full h-8 bg-gray-300 border-2 border-black">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 transition-width duration-500 ease-in"
              style={{ width: `${100}%` }}
            ></div>
          </div>
        </div> */}
        <BlueBar />
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
