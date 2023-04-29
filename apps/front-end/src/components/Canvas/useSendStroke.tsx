import { useEffect, useState } from "react";
import { useSocket } from "./Websocketprovider";
import { Stroke } from "./History";

type Message = {
  type: string;
  body: string;
  user: string;
  room_id: string;
};

const onMessage = (e: MessageEvent) => {
  const message: Message = JSON.parse(e.data);
  if (message.type === "stroke") {
    const stroke: Stroke = JSON.parse(message.body);
    return stroke;
  }
};

export default function useSendStroke(ctx: React.MutableRefObject<CanvasRenderingContext2D | null>) {
  const { getClient } = useSocket();
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  useEffect(() => {
    const socket = getClient();
    if (!socket) return;
    const onMessage = (e: MessageEvent) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === "stroke") {
        const stroke: Stroke = JSON.parse(message.body);
        setCurrentStroke(stroke);
      }
    };
    socket.addEventListener("message", onMessage);

    socket.onclose = () => {
        setTimeout(() => {
            socket.send(
                JSON.stringify({
                    type: "reconnect",
                    body: JSON.stringify({}),
                })
            );
        }, 1000);
    };
    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [getClient()]);

  useEffect(() => {
    if (!currentStroke) return;

    if (!ctx.current) return;

    if (!currentStroke[0].x || !currentStroke[0].y) return;

    ctx.current.beginPath();

    ctx.current.moveTo(currentStroke[0].x, currentStroke[0].y);
    currentStroke.forEach((point) => {
      const { x, y } = point;
      if (!x || !y) return;
      ctx.current?.lineTo(point.x, point.y);
    });
    ctx.current.stroke();
  }, [currentStroke]);

  return (stroke: Stroke) => {
    const socket = getClient();
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "stroke",
          body: JSON.stringify(stroke),
          user: "non-chan",
          room_id: "default",
        })
      );
    }
  };
}
