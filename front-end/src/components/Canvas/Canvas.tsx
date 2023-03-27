import { useEffect, useMemo, useRef, useState } from "react";
import { useMessages } from "../../lib/ws";
import { DrawHistory } from "./History";
import { Toolbar } from "./ToolBar";
import { useDraw } from "./useDraw";
import { useSocket } from "./Websocketprovider";
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

function drawLine({ ctx, previousPoint, currentPoint }: Draw) {
  const { x: currX, y: currY } = currentPoint;
  let startPoint = previousPoint ?? currentPoint;
  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
}

export default function Canvas(props: props) {
  const { width, height } = props;
  const { socket, isConnected: connected, onStateChange } = useSocket();
  const { canvasRef, onMouseDown, onMouseUp, history } = useDraw(createLine);

  function createLine({ ctx, previousPoint, currentPoint }: Draw) {
    socket?.send(
      JSON.stringify({
        type: "stroke",
        user: "non-chan",
        room_id: "default",
        body: JSON.stringify({ currentPoint, previousPoint }),
      })
    );
    drawLine({ ctx, previousPoint, currentPoint });
  }
  useEffect(() => {
    if (!socket) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const onMessage = (e: MessageEvent) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === "stroke") {
        const stroke: Stroke = JSON.parse(message.body);
        drawLine({ ctx, previousPoint: stroke.previousPoint, currentPoint: stroke.currentPoint });
      }
    };
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, canvasRef.current]);

  const [isConnected, setIsConnected] = useState(connected);

  useEffect(() => {
    return onStateChange(setIsConnected)
    }, [connected]);
  return (
    <div id='drawingBoard' className='w-[900px]  h-[700px]'>
      <canvas onMouseDown={onMouseDown} onMouseUp={onMouseUp} className='canvas rounded-lg bg-white shadow-lg' ref={canvasRef} width={width} height={height} />
      {isConnected ? <div className='text-green-500'>Connected</div> : <div className='text-red-500'>Disconnected</div>}
      <Toolbar history={history} canvasRef={canvasRef} width={width} height={height} />
    </div>
  );
}
