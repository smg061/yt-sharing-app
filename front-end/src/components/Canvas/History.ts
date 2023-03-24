type DrawEvent = {
    type: "draw";
    data: {
        history: Array<Array<number>>;
    };
};

export type Point = {
    x: number;
    y: number;
    color?: string;
    size?: number;
}
export class DrawHistory {

    private history: Array<Array<Point>> = [];
    private current: Array<Point> = [];

    private static readonly MAX_HISTORY_LENGTH = 100;

    addPoint(point: Point) {
        if (this.history.length >= DrawHistory.MAX_HISTORY_LENGTH) {
            this.history.shift();
        }
        this.current.push(point);
    }

    addStroke() {
        this.history.push(this.current);
        this.current = [];
    }

    getHistory() {
        return this.history;
    }

    undo() {
        this.history.pop();
    }

    getStrokes() {
        return this.history;
    }

    clear() {
        this.history = [];
        this.current = [];
    }
}

