import { useEffect, useMemo, useRef, useState } from "react";
import { DrawHistory } from "./History";

export function useDraw(onDraw: ({ ctx, previousPoint, currentPoint }: Draw) => void) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const prevPoint = useRef<Point | null>(null);

  const [drawing, setDrawing] = useState<boolean>(false);

  const history = useMemo(() => new DrawHistory(), []);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setDrawing(true);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setDrawing(false);
    history.addStroke();
    prevPoint.current = null;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!drawing) return;
      const point = computePoint(e);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !point) return;

      history.addPoint(point);

      onDraw({ ctx, previousPoint: prevPoint.current, currentPoint: point });
      prevPoint.current = point;
    };

    const computePoint = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };
    canvasRef.current?.addEventListener("mousemove", handler);
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
    };
  }, [drawing]);

  return { canvasRef, onMouseDown, onMouseUp, history };
}
