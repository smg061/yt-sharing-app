"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const Queue_1 = require("./Queue");
const SocketService_1 = require("./SocketService");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || "3000";
const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED } = SocketService_1.SOCKET_EVENT;
const videoQueue = new Queue_1.Queue();
let currentVideo = null;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    if (currentVideo) {
        socket.emit(VIDEO_ENDED, currentVideo);
    }
    socket.on(NEW_MESSAGE, (data) => {
        io.emit(NEW_MESSAGE, data);
    });
    socket.on(VIDEO_QUEUED, (data) => {
        if (currentVideo === null || currentVideo === undefined) {
            console.log('no more videos, directly sending current video', data);
            io.emit(VIDEO_ENDED, data);
            currentVideo = data;
            return;
        }
        videoQueue.enqueue(data);
        io.emit(VIDEO_QUEUED, data);
    });
    socket.on(VIDEO_ENDED, () => {
        const url = videoQueue.dequeue();
        currentVideo = url;
        if (typeof url !== "undefined") {
            io.emit(VIDEO_ENDED, url);
        }
    });
    socket.on("disconnect", (data) => console.log(data));
});
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URI || "*",
}));
app.get("/", (_, res) => {
    res.send("Hello world from ts server!");
});
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
