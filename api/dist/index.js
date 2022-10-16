"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const SocketService_1 = require("./SocketService");
const VideoQueue_1 = require("./Models/VideoQueue");
const utils_1 = require("./utils");
const dotenv_1 = __importDefault(require("dotenv"));
const fetch = import ("node-fetch")
dotenv_1.default.config();
const port = process.env.PORT || "3000";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED } = SocketService_1.SOCKET_EVENT;
const videoQueue = new VideoQueue_1.VideoQueue();
let currentVideo = null;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const clients = new Map();
io.on("connection", (socket) => {
    clients.set(socket.id, socket);
    if (currentVideo) {
        socket.emit(VIDEO_ENDED, currentVideo);
    }
    socket.on(NEW_MESSAGE, (data) => {
        io.emit(NEW_MESSAGE, data);
    });
    socket.on(VIDEO_QUEUED, (data) => {
        if (currentVideo === null || currentVideo === undefined) {
            console.log("no more videos, directly sending current video", data);
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
app.get("/health", (_, res) => {
    res.status(200).send("All green!");
});
app.get("/clearQueue", (_, res) => {
    currentVideo = null;
    for (let i = 0; i < videoQueue.getItems().length; i++) {
        videoQueue.dequeue();
    }
    res.status(200).send("Queue cleared!");
});
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
app.get("/videoSearch", async (req, res) => {
    const searchTerm = req.query?.video;
    if (typeof searchTerm !== "string") {
        res.status(400).send("Bad request");
    }
    const generalSearchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${searchTerm}`;
    const result = await fetch(generalSearchUrl);
    const data = await result.json();
    res.status(200).send((0, utils_1.toVideoResponse)(data.items));
});
