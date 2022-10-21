import { Server } from "socket.io";
import { Message } from "../types";
import { SOCKET_EVENT } from "../SocketEvents";
import { VideoQueue } from "./VideoQueue";
const { NEW_MESSAGE, USER_CONNECTED, SKIP_VIDEO, VIDEO_ENDED, VIDEO_QUEUED } = SOCKET_EVENT

export class Room {
    private readonly name: string;
    public users: any[];
    private io: Server;
    private videoQueue: VideoQueue
    constructor(name: string, io: Server) {
        this.name = name;
        this.users = [];
        this.io = io;
        this.videoQueue = new VideoQueue();
    }

    public listenOnRoom() {
        this.io.on('connection', (socket) => {
            console.log(`User with connection id of ${socket.id} joined room ${this.name}`)
            socket.emit(USER_CONNECTED, () => {
            })
            socket.on(NEW_MESSAGE, (data: Message) => {
                this.io.emit(NEW_MESSAGE, data)
            })
            if (this.videoQueue.currentVideo) {
                socket.emit(VIDEO_ENDED, this.videoQueue.currentVideo);
            }
            socket.on(VIDEO_QUEUED, (data: string) => {
                console.log('video queue request: ', data)
                if (this.videoQueue.currentVideo === null || this.videoQueue.currentVideo === undefined) {
                    console.log("no more videos, directly sending current video", data);
                    this.io.emit(VIDEO_ENDED, data);
                    this.videoQueue.currentVideo = data;
                    return;
                }
                this.videoQueue.enqueue(data);
                console.log(this.videoQueue.getItems())
                this.io.emit(VIDEO_QUEUED, data);
            });
            socket.on(VIDEO_ENDED, () => {
                const url = this.videoQueue.dequeue();
                this.videoQueue.currentVideo = url;
                if (typeof url !== "undefined") {
                    this.io.emit(VIDEO_ENDED, url);
                }
            });
            socket.on(SKIP_VIDEO, () => {
                console.log('skip video event triggered')
                const newVideo = this.videoQueue.dequeue();
                if (newVideo) {
                    this.videoQueue.currentVideo = newVideo;
                    this.io.emit(VIDEO_ENDED, newVideo)
                }
            })
            socket.on("disconnect", (data) => console.log(data));
        })
    }
    public clearQueue() {
        for (let i = 0; i < this.videoQueue.getItems().length; i++) {
            this.videoQueue.dequeue();
        }

    }
}