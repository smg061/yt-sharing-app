import { Namespace, Server, Socket } from "socket.io";
import { Room } from "../Room";

export enum DrawEvents {
    DRAW = 'draw',
    CLEAR = 'clear',
    UNDO = 'undo',
}

const { DRAW, CLEAR, UNDO } = DrawEvents;

type DrawEvent = {
    type : typeof DRAW | typeof CLEAR | typeof UNDO,
    data: {
        x: number,
        y: number,
        color: string,
        size: number,
    }
}
export class DrawHistory {
    // class to sync drawing between clients
    private history: Array<DrawEvent> = [];

    public add(data: DrawEvent) {
        this.history.push(data);
    }

    public get() {
        return this.history;
    }
}

export class DrawingRoom {

    // class to sync drawing between clients
    private drawHistory: DrawHistory = new DrawHistory();
    public name: string;
    public id: string;
    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
   
    

    public addDrawEvent(data: DrawEvent) {
        this.drawHistory.add(data);
    }


}

export class DrawingRoomsManager {
    private rooms: Map<string, DrawingRoom> = new Map();
    private io: Namespace;
    private maxId: number = 0;

    constructor(io: Server) { 
        this.io = io.of('/draw');
    }
    private getId() {
        return `room-${this.maxId++}`;
    }
    public listenForEvents() {
            this.io.on(DRAW, (data: {roomId: string, payload: DrawEvent}) => {
                const { roomId, payload } = data;
                const room = this.getRoom(roomId);
                if (!room) return;
                room.addDrawEvent(payload);
                this.io.to(room.id).emit('draw', data);
            });

    }

    public addRoom(name:string) {
        const id = this.getId();
        const drawingRoom = new DrawingRoom(name,id);
        this.rooms.set(id, drawingRoom);
    }

    public removeRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    public getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }
}