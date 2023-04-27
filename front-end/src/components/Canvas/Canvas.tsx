import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useMessages } from "@/lib/ws";
import { DrawHistory } from "./History";
import { Toolbar } from "./ToolBar";
import { useDraw } from "./useDraw";
import { useSocket } from "./Websocketprovider";
import { useToolbarCtx } from "./ToolbarContext";
import useMousePosition from "@hooks/useMousePosition";
type props = {
  width: number;
  height: number;
};

type Message = {
  type: string;
  body: string;
  user: string;
  room_id: string;
};

function drawLine({
  ctx,
  previousPoint,
  currentPoint,
  brushColor,
  brushSize,
  brushType,
}: Draw) {
  const { x: currX, y: currY } = currentPoint;
  let startPoint = previousPoint ?? currentPoint;
  ctx.beginPath();
  if (brushColor) {
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;
  }
  if (brushSize) {
    ctx.lineWidth = brushSize;
  }
  if (brushType) {
    ctx.lineCap = brushType;
  }
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
}

function GridSVG() {
  return (
    <svg className="w-full h-full absolute" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="smallGrid"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 8 0 L 0 0 0 8"
            fill="none"
            stroke="gray"
            stroke-width="0.5"
          />
        </pattern>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="url(#smallGrid)" />
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="gray"
            stroke-width="1"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  for (let x = 0.5; x < ctx.canvas.width; x += 10) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
  }
}

export default function Canvas(props: props) {
  const { width, height } = props;
  const {
    getClient,
    isConnected: isSocketConnected,
    onStateChange,
  } = useSocket();
  const { canvasRef, onMouseDown, onMouseUp, history } = useDraw(createLine);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const { state } = useToolbarCtx();
  const [isConnected, setIsConnected] = useState(isSocketConnected());

  function createLine({ ctx, previousPoint, currentPoint }: Draw) {
    const socket = getClient();
    if (!socket || !isSocketConnected()) return;

    socket?.send(
      JSON.stringify({
        type: "stroke",
        user: "non-chan",
        room_id: "default",
        body: JSON.stringify({
          currentPoint,
          previousPoint,
          brushColor: state.brushColor,
          brushSize: state.brushSize,
          brushType: state.brushType,
        }),
      })
    );
    drawLine({
      ctx,
      previousPoint,
      currentPoint,
      brushColor: state.brushColor,
      brushSize: state.brushSize,
      brushType: state.brushType,
    });
  }
  useEffect(() => {
    const socket = getClient();
    if (!socket || !isSocketConnected()) return;
    socket.send(
      JSON.stringify({
        type: "join",
        body: "",
        userId: "non-chan",
        room_id: "default",
      })
    );
  }, [isSocketConnected()]);
  useEffect(() => {
    const socket = getClient();
    if (!socket) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const onMessage = (e: MessageEvent) => {
      const message: Message = JSON.parse(e.data);
      switch (message.type) {
        case "stroke":
          const stroke: Stroke = JSON.parse(message.body);
          drawLine({
            ctx,
            previousPoint: stroke.previousPoint,
            currentPoint: stroke.currentPoint,
            brushColor: stroke.brushColor,
            brushSize: stroke.brushSize,
            brushType: stroke.brushType,
          });
          break;
        case "clear":
          ctx.clearRect(0, 0, width, height);
          break;
        case "join":
          setConnectedUsers((prev) => [...prev, message.user]);
          break;
        default:
          break;
      }
    };
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [getClient(), canvasRef.current]);
  useEffect(() => {
    return onStateChange(setIsConnected);
  }, [isSocketConnected()]);

  return (
    <div id="drawingBoard" className="w-[900px]  h-[700px]">
      <canvas
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className="canvas z-50 rounded-lg bg-white shadow-lg"
        ref={canvasRef}
        width={width}
        height={height}
      ></canvas>

      {isConnected ? (
        <div className="text-green-500">Connected</div>
      ) : (
        <div className="text-red-500">Disconnected</div>
      )}
      <div className="text-gray-500">
        {connectedUsers.length} Connected Users: {connectedUsers.join(", ")}
      </div>
      <Toolbar
        history={history}
        canvasRef={canvasRef}
        width={width}
        height={height}
      />
      <MouseCursor canvasRef={canvasRef} />
    </div>
  );
}

function MouseCursor({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const mouseCoords = useRef({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const [canvasRect, setCanvasRect] = useState<DOMRect>();
  const [positionInCanvas, setPositionInCanvas] = useState({ x: 0, y: 0 });
  const { x, y } = mouseCoords.current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setCanvasRect(rect);
  }, [canvasRef.current]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseCoords.current = {
        x: clientX,
        y: clientY,
      };
      const el = cursorRef.current;
      if (!el) return;
      el.style.left = `${clientX}px`;
      el.style.top = `${clientY}px`;
      if (!canvasRect) return;
      const x = clientX - canvasRect.x;
      const y = clientY - canvasRect.y;
      setPositionInCanvas({ x, y });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [canvasRef.current]);
  return (
    <div
      className="absolute flex cursor-none cursor-follow pointer-events-none "
      ref={cursorRef}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -45%)",
      }}
    >
      <svg
        className=" w-24 h-24 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        opacity={0.4}
      >
        <circle cx="10" cy="10" r="10" />
      </svg>
      <div className="absolute top-0  left-full text-xs text-gray-500 bg-slate-200 rounded-lg">
        {positionInCanvas.x}, {positionInCanvas.y}
      </div>
    </div>
  );
}
