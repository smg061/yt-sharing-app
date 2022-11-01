import { Server, Socket } from "socket.io";
import { Message, VideoInfo } from "../types";
import { SOCKET_EVENT } from "../SocketEvents";
import { VideoQueue } from "./VideoQueue";
const { NEW_MESSAGE, SET_QUEUE_ON_CONNECT, CONNECT, USER_CONNECT, SKIP_VIDEO, VIDEO_ENDED, VIDEO_QUEUED, VOTE_TO_SKIP, SKIPPING_IN_PROGRESS, JOIN_ROOM } = SOCKET_EVENT


export class RoomsManager {

    private rooms: Map<string, NewRoom> = new Map();
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

    private emitEventScoped<T>(event: SOCKET_EVENT, payload: T, id: string) {
        this.io.to(id).emit(event, payload)
    }
    public getRoomById(id: string) {
        const room = this.rooms.get(id);
        return room;
    }
    public listenForEvents() {
        this.io.on(CONNECT, (socket: Socket) => {
            socket.on(JOIN_ROOM, ({ roomId }: { userId: string, roomId: string }) => {
                console.log(`${socket.id} joined ${roomId}`)
                socket.join(roomId);
            })
            socket.on(USER_CONNECT, (data: { userId: string, roomId: string }) => {
                const room = this.rooms.get(data.roomId);
                if (!room) return;
                if (this.rooms.get(data.roomId)!.videoQueue.currentVideo) {
                    console.log('sending a bunch of videos your way!!!');
                    this.io.to(data.roomId).emit(SET_QUEUE_ON_CONNECT, [room.videoQueue.currentVideo, ...room.videoQueue.getItems()], data.roomId);
                }
                if (room.videoQueue.currentVideo) {
                    this.io.to(data.roomId).emit(VIDEO_ENDED, room.videoQueue.currentVideo, data.roomId)
                }
                room.connectedUsers.set(data.userId, socket);
                this.io.to(data.roomId).emit(USER_CONNECT, room.connectedUsers.size, data.roomId);
            })
            socket.on(NEW_MESSAGE, (data: { payload: Message, roomId: string }) => {
                this.io.to(data.roomId).emit(NEW_MESSAGE, { payload: data.payload });
            })

            socket.on(VIDEO_QUEUED, (data: { payload: VideoInfo, roomId: string }) => {
                console.log()
                const room = this.rooms.get(data.roomId);
                console.log(`queued video ${JSON.stringify(data)}`)
                if (!room) return;
                if (room.videoQueue.currentVideo === null || room.videoQueue.currentVideo === undefined) {
                    console.log('sending this single video to client')
                    this.io.to(data.roomId).emit(VIDEO_ENDED, (data.payload));
                    room.videoQueue.currentVideo = data.payload;
                    return;
                }
                room.videoQueue.enqueue(data.payload);
                this.io.to(data.roomId).emit(VIDEO_QUEUED, room.videoQueue.getItems());
            });
            socket.on(VIDEO_ENDED, ({ roomId }: { roomId: string }) => {
                const room = this.rooms.get(roomId)
                if (!room) return;
                const video = room.videoQueue.dequeue();
                room.videoQueue.currentVideo = video;
                if (typeof video !== "undefined") {
                    this.emitEventScoped(VIDEO_ENDED, video, roomId);
                }
            });
            this.handleSkipEvents(socket)
            socket.on("disconnect", () => {
                this.removeUser(socket.id);
            });
        })

    }
    private handleSkipEvents(socket: Socket) {
        socket.on(VOTE_TO_SKIP, (data: {userId: string, roomId: string}) => {
            const {roomId, userId} = data;
            const room = this.rooms.get(roomId);
            console.log('voting to skip...')
            console.log(roomId, room)
            if(!room) return;
            // if there's no video or if the user already voted (is there a better way to track this?)
            // do not continue
            if (!room.videoQueue.currentVideo) {
                console.log(`there is no current video to skip ${room.videoQueue.currentVideo}`);
                return;
            }
            // if (!room.connectedUsers.has(userId)) {
            //     
            //     //return;
            // }
            if (room.usersWhoVoted.includes(userId)) {
               // console.log("You voted already ya cheeky bastard. Bugger off " + socket.id);
                return;
            }
            // add to keep track of users who voted
            room.usersWhoVoted.push(userId)
            room.skipCurrentVideoVotes += 1;
            this.io.to(roomId).emit(VOTE_TO_SKIP, { currentVotes: room.skipCurrentVideoVotes, totalUsers: room.connectedUsers.size });
            const proportion = room.skipCurrentVideoVotes / room.connectedUsers.size;
            if (proportion >= 0.51) {
                console.log("more than half of users chose to skip this video!")
                const newVideo = room.videoQueue.dequeue();
                // only do it if there's a video and 
                // no pending skips exist
                if (newVideo && !room.skipPending) {
                    room.skipPending = true;
                    room.videoQueue.currentVideo = newVideo;
                    this.io.to(roomId).emit(SKIPPING_IN_PROGRESS, null);
                    setTimeout(() => {
                        // emit relevant event and reset state
                        // 5 secs in the future
                        room.usersWhoVoted = [];
                        this.io.to(roomId).emit(VIDEO_ENDED, newVideo)
                        room.skipPending = false
                        room.skipCurrentVideoVotes = 0;
                    }, 5000)
                }
            }
        })
        socket.on(SKIP_VIDEO, (roomId: string) => {
            // if(!socket.rooms.has(this.id)) return
            const room = this.rooms.get(roomId)
            if(!room) return;

            const newVideo = room.videoQueue.dequeue();
            if (typeof newVideo !== 'undefined') {
                room.videoQueue.currentVideo = newVideo;
                this.io.to(roomId).emit(VIDEO_ENDED, newVideo)
            }
        })
    }
    private removeUser(socketId: string) {
        this.rooms.forEach((room) => {
            room.removeUser(socketId);
        })
    }
    public addRoom(roomName: string) {
        const id = this.getId();
        const room = new NewRoom(roomName, id,);
        this.rooms.set(id, room);
        //room.listenForEvents();
        return room
    }

    public listRooms() {
        const roomRepr = [];
        for (let [id, room] of this.rooms) {
            roomRepr.push({ id, name: room.name, numberOfUsers: room.length, currentlyPlaying: room.currentlyPlaying?.title ?? '' })
        }
        return roomRepr;
    }
}

export class NewRoom {
    public name: string;
    public id: string;
    //private eventsAreRegistered: boolean = false;
    public videoQueue: VideoQueue = new VideoQueue();
    public skipCurrentVideoVotes: number = 0;
    public skipPending: boolean = false;
    public connectedUsers: Map<string, Socket> = new Map();
    public usersWhoVoted: string[] = [];

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    get length() {
        return this.connectedUsers.size;
    }

    get currentlyPlaying() {
        return this.videoQueue.currentVideo
    }

    // emits event only to the current room

    public removeUser(socketId: string) {
        let userId = ''; // userId is the value provided from session storage
        for (const [id, socket] of this.connectedUsers) {
            if (socket.id === socketId) {
                userId = id;
            }
        }
        if (userId.length) {
            console.info(`user with socket id ${socketId} and user id ${userId} was removed`)
            this.connectedUsers.delete(userId);
            this.usersWhoVoted = this.usersWhoVoted.filter(x => x !== userId);
        }
    }

    public clearQueue() {
        for (let i = 0; i < this.videoQueue.getItems().length; i++) {
            this.videoQueue.dequeue();
        }
    }
    public listUsers() {
        const users = []
        for (let [key, val] of this.connectedUsers) {
            users.push({ userId: key, connectionId: val.id })
        }
        return users
    }
}