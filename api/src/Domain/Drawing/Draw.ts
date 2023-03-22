import { Server, Socket } from "socket.io";
import { Room } from "../Room";

export enum DrawEvents {
    DRAW = 'draw',
    CLEAR = 'clear',
    UNDO = 'undo',
}

const { DRAW, CLEAR, UNDO } = DrawEvents;

export class DrawHistory {
    // class to sync drawing between clients
    private history: Array<any> = [];

    public add(data: any) {
        this.history.push(data);
    }

    public get() {
        return this.history;
    }
}

export class Draw {

    // class to sync drawing between clients
    private drawHistory: DrawHistory = new DrawHistory();
    private io: Server;
    private roomId: string;
    private userId: string;
    private socket: Socket;
    private room: Room;

    constructor(io: Server, roomId: string, userId: string, socket: Socket, room: Room) {
        this.io = io;
        this.roomId = roomId;
        this.userId = userId;
        this.socket = socket;
        this.room = room;
    }

    public listenForEvents() {
        this.socket.on(DRAW, (data: any) => {
            this.drawHistory.add(data);
            this.io.to(this.roomId).emit('draw', data);
        });

        this.socket.on(CLEAR, () => {
            this.drawHistory = new DrawHistory();
            this.io.to(this.roomId).emit('clear');
        });

        this.socket.on(UNDO, () => {
            this.drawHistory.get().pop();
            this.io.to(this.roomId).emit('undo');
        });
    }
    
}