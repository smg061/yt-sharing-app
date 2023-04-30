import UwuWelcome from "@/components/LandingBanner";
import RetroLoader from "@/components/loaders/RetroLoader";
import { WithSuspense, WithSuspenseHOC } from "@/utils/WithSuspense";

import { lazy } from "react";
const Canvas3D = lazy(() => import("@/components/3D/Canvas3D"));

const CanvasWithSuspense = WithSuspenseHOC(Canvas3D);

export function Home() {
  return (
    <div className="relative grid  md:grid-cols-4">
      <div className="">
        <CanvasWithSuspense
          text={{
            body: "Hewwo everynyan [^._.^]ﾉ彡",
            title: "Hewwo",
            position: [-1, 1, 1],
            rotation: [0, 0, 0],
          }}
        />
      </div>
      <div className="col-span-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <UwuWelcome />
      </div>
      <div className="hidden md:block">
        <CanvasWithSuspense
          text={{
            body: "Hewwo everynyan [^._.^]ﾉ彡",
            title: "Hewwo",
            position: [-1, 1, 1],
            rotation: [0, 0, 0],
          }}
        />
      </div>
    </div>
  );
}
