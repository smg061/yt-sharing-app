import { useEffect } from "react";
import useMousePosition from "../../hooks/useMousePosition";

export function MousePointerDot({

  x,
  y
}: {

  x: number;
  y: number;
}) {
  //   const [{ x, y }, handleCursorMovement] = useMousePosition();

  //   console.log(x, y);

  //   useEffect(() => {
  //     if (!canvasRef.current) return;
  //     canvasRef.current.addEventListener("mousemove", handleCursorMovement);
  //     return () => {
  //       canvasRef.current?.removeEventListener("mousemove", handleCursorMovement);
  //     };
  //   }, [canvasRef.current]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12" y2="16"></line>
      </svg>
    </div>
  );
}
