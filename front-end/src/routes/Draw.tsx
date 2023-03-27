import { useEffect, useMemo, useRef, useState } from "react";
import Canvas from "../components/Canvas/Canvas";
import { DrawHistory } from "../components/Canvas/History";
import { Toolbar } from "../components/Canvas/ToolBar";
import { getCanvasAndContext } from "../components/Canvas/utils";
import SocketProvider from "../components/Canvas/Websocketprovider";

export default function DrawTogether() {

  const [canvasWidth, setCanvasWidth] = useState<number>(1000);
  const [canvasHeight, setCanvasHeight] = useState<number>(700);

  return (
    <SocketProvider>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-center">Draw Together</h1>
        <p className="text-xl font-bold text-center">
          Draw together with your friends
        </p>
        <div className="flex flex-col items-center justify-center h-screen">

          <Canvas   width={canvasWidth} height={canvasHeight}/>
        </div>
      </div>
    </SocketProvider>
  );
}
