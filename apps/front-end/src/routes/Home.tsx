import UwuWelcome from "@/components/LandingBanner";

import { lazy } from "react";
const Canvas3D = lazy(() => import("@/components/3D/Canvas3D"));

export function Home() {
  return (
    <div className="relative grid  md:grid-cols-3">
      <div className="" >
          <Canvas3D
            text={{
              body: "Hewwo everynyan [^._.^]ﾉ彡",
              title: "Hewwo",
              position: [-1, 1, 1],
              rotation: [0, 0, 0],
            }}
          />

      </div>
      <UwuWelcome />
      <div className="hidden md:block" >
          <Canvas3D
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
