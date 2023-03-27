type Point = {
    x: number;
    y: number;
}

type Stroke = {
    previousPoint: Point | null;
    currentPoint: Point;
}

type DrawEvent = {
    type: "draw";
    data: {
        history: Array<Array<Point>>;
    };
};

type Draw = {
    ctx: CanvasRenderingContext2D;
    currentPoint: Point;
    previousPoint: Point | null;
}