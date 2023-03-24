export function getCanvasAndContext(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
    const canvas = canvasRef.current;
    if (!canvas) return {
        canvas: null,
        ctx: null
    }
    ;
    const ctx = canvas.getContext("2d");
    if (!ctx) 
    return {
        canvas: null,
        ctx: null
    }
    return {canvas, ctx};
}