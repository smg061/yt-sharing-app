import { useEffect, useMemo, useRef, useState } from "react";
import { DrawHistory } from "./History";
import { getCanvasAndContext } from "./utils";

type props = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    history: DrawHistory;
    width: number;
    height: number;
}



export default function Canvas(props: props) {

    const {canvasRef, width, height, history} = props;

    const contextRef= useRef<CanvasRenderingContext2D | null>(null);  

    const [drawing, setDrawing] = useState(false);

    
    const starDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {

        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        setDrawing(true);
        const {offsetX: x, offsetY: y} = e.nativeEvent;
        ctx.beginPath();
        ctx.moveTo(x, y);
        history.addPoint({x, y});

    }
    const stopDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        setDrawing(false);
        ctx.closePath();
        history.addStroke();
    }
    const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx|| !drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
        history.addPoint({x, y});
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        contextRef.current = ctx;
    }, [canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
    }, [canvasRef]);



    return (
        <>

            <canvas
            className="canvas rounded-lg"
            onMouseDown={starDraw}
            onMouseUp={stopDraw}
            onMouseMove={draw}
            ref={canvasRef} width={width} height={height}/>
        </>
    );
}