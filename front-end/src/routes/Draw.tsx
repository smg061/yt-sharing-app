import { useEffect, useMemo, useRef, useState } from "react";
import Canvas from "../components/Canvas/Canvas";
import { DrawHistory } from "../components/Canvas/History";
import { Toolbar } from "../components/Canvas/ToolBar";
import { getCanvasAndContext } from "../components/Canvas/utils";
import SocketProvider from "../components/Canvas/Websocketprovider";
import ToolbarProvider from "../components/Canvas/ToolbarContext";

export default function DrawTogether() {
  return (
    <SocketProvider>
      <ToolbarProvider>
        <div className="flex flex-col items-center justify-center h-full overflow-hidden scroll-">
          <h1 className="text-4xl font-bold text-center">Draw Together</h1>
          <p className="text-xl font-bold text-center">
            Draw together with your friends
          </p>
          <Canvas width={900} height={700} />
        </div>
      </ToolbarProvider>
    </SocketProvider>
  );
}
