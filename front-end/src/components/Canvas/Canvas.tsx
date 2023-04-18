import { useEffect, useMemo, useRef, useState } from "react";
import { useMessages } from "../../lib/ws";
import { DrawHistory } from "./History";
import { Toolbar } from "./ToolBar";
import { useDraw } from "./useDraw";
import { useSocket } from "./Websocketprovider";
import { useToolbarCtx } from "./ToolbarContext";
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

export default function Canvas(props: props) {
  const { width, height } = props;
  const {
    getClient,
    isConnected: isSocketConnected,
    onStateChange,
  } = useSocket();
  const { canvasRef, onMouseDown, onMouseUp, history } = useDraw(createLine);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const { state }= useToolbarCtx();

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
    drawLine({ ctx, previousPoint, currentPoint, brushColor: state.brushColor, brushSize: state.brushSize, brushType: state.brushType });
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

  const [isConnected, setIsConnected] = useState(isSocketConnected());

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
      />
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
    </div>
  );
}
