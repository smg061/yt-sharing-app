import { Server, Socket } from "socket.io";
import { Message, VideoInfo } from "../types";
import { SOCKET_EVENT } from "../SocketEvents";
import { VideoQueue } from "./VideoQueue";
const { NEW_MESSAGE, CONNECT, USER_CONNECT, SKIP_VIDEO, VIDEO_ENDED, VIDEO_QUEUED, VOTE_TO_SKIP, SKIPPING_IN_PROGRESS } = SOCKET_EVENT


export class RoomsManager {

    private rooms: Map<string, Room> = new Map();
    private io: Server;
    private maxId: number = 0;
    constructor(io: Server) {
        this.io = io;
    }
    private getId() {
        return `room-${this.maxId++}`;
    }
    get length() {
        return this.rooms.size;
    }
    public addRoom(roomName: string) {
        const id = this.getId();
        const room = new Room(roomName, id, this.io);
        this.rooms.set(id, room);
        return room
        //this.rooms.get(id)?.listenForEvents();
    }
    public listRooms() {
        const roomRepr = [];
        for (let [id, room] of this.rooms) {
            roomRepr.push({ id, name: room.name, numberOfUsers: room.length, currentlyPlaying: room.currentlyPlaying?.description ?? '' })
        }
        return roomRepr;
    }
}
export class Room {
    public name: string;
    public id: string;
    private eventsAreRegistered: boolean = false;
    private io: Server;
    private videoQueue: VideoQueue = new VideoQueue();
    private skipCurrentVideoVotes: number = 0;
    private skipPending: boolean = false;
    private connectedUsers: Map<string, Socket> = new Map();
    private usersWhoVoted: string[] = [];

    constructor(name: string, id: string, io: Server) {
        this.name = name;
        this.io = io;
        this.id = id;
    }

    get length() {
        return this.connectedUsers.size;
    }

    get currentlyPlaying() {
        return this.videoQueue.currentVideo
    }

    // emits event only to the current room
    private emitEventScoped<T>(event: SOCKET_EVENT, payload: T) {
        this.io.to(this.id).emit(event, payload)
    }
    public listenForEvents() {
        if (this.eventsAreRegistered) throw new Error(`Tried to listen to listen to events twice for room ${this.id}`);
        this.io.on(CONNECT, (socket: Socket) => {
            socket.join(this.id);
            socket.on(USER_CONNECT, (data: {userId: string})=> {
                console.log(`User with local id of ${data.userId} joined room ${this.id} ${this.name}`)
                this.connectedUsers.set(data.userId, socket);
            })
            socket.on(NEW_MESSAGE, (data: Message) => {
                this.emitEventScoped(NEW_MESSAGE, data)
            })
            if (this.videoQueue.currentVideo) {
                this.emitEventScoped(VIDEO_ENDED, this.videoQueue.currentVideo)
            }
            socket.on(VIDEO_QUEUED, (data: VideoInfo) => {
                if (this.videoQueue.currentVideo === null || this.videoQueue.currentVideo === undefined) {
                    this.emitEventScoped(VIDEO_ENDED, (data));
                    this.videoQueue.currentVideo = data;
                    return;
                }
                this.videoQueue.enqueue(data);
                this.emitEventScoped(VIDEO_QUEUED, this.videoQueue.getItems());
            });
            socket.on(VIDEO_ENDED, () => {
                const video = this.videoQueue.dequeue();
                this.videoQueue.currentVideo = video;
                if (typeof video !== "undefined") {
                    this.emitEventScoped(VIDEO_ENDED, video);
                }
            });
            this.handleSkipEvents(socket);
            socket.on("disconnect", () => {
                this.removeUser(socket.id);
            });
        })
        this.eventsAreRegistered = true;
    }

    private removeUser(socketId: string) { 
        let userId = ''; // userId is the value provided from session storage
        if(userId.length) {
            console.info(`user with socket id ${socketId} and user id ${userId} was removed`)
            this.connectedUsers.delete(userId);
            this.usersWhoVoted = this.usersWhoVoted.filter(x=> x!== userId);
        }
    }
    private handleSkipEvents(socket: Socket) {
        socket.on(VOTE_TO_SKIP, (data: string) => {
            // if there's no video, if the user is not in connected user (weird paranoia)
            // or if the user already voted (is there a better way to track this?)
            // do not continue
            if (!this.videoQueue.currentVideo ||
                !this.connectedUsers.has(data)
            ) {
                console.log(`Id of ${data} is not present in current users or there is no current video to skip ${this.videoQueue.currentVideo}`);
                return;
            }
            if (this.usersWhoVoted.includes(data)) {
                console.log("You voted already ya cheeky bastard. Bugger off " + socket.id);
                return;
            }
            // add to keep track of users who voted
            this.usersWhoVoted.push(data)

            this.skipCurrentVideoVotes += 1;
            this.emitEventScoped(VOTE_TO_SKIP, { currentVotes: this.skipCurrentVideoVotes, totalUsers: this.connectedUsers.size });
            const proportion = this.skipCurrentVideoVotes / this.connectedUsers.size;
            if (proportion >= 0.51) {
                console.log("more than half of users chose to skip this video!")
                const newVideo = this.videoQueue.dequeue();
                // only do it if there's a video and 
                // no pending skips exist
                if (newVideo && !this.skipPending) {
                    this.skipPending = true;
                    this.videoQueue.currentVideo = newVideo;
                    this.emitEventScoped(SKIPPING_IN_PROGRESS, null);
                    setTimeout(() => {
                        // emit relevant event and reset state
                        // 5 secs in the future
                        this.usersWhoVoted = [];
                        this.emitEventScoped(VIDEO_ENDED, newVideo)
                        this.skipPending = false
                        this.skipCurrentVideoVotes = 0;
                    }, 5000)
                }
            }
        })
        socket.on(SKIP_VIDEO, () => {
            const newVideo = this.videoQueue.dequeue();
            if (typeof newVideo !== 'undefined') {
                this.videoQueue.currentVideo = newVideo;
                this.emitEventScoped(VIDEO_ENDED, newVideo)
            }
        })
    }
    public clearQueue() {
        for (let i = 0; i < this.videoQueue.getItems().length; i++) {
            this.videoQueue.dequeue();
        }

    }
}