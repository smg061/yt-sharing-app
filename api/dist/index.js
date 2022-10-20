"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const VideoSearchService_1 = require("./Services/VideoSearchService");
const scrape_youtube_1 = require("scrape-youtube");
dotenv_1.default.config();
const port = process.env.PORT || "3000";
//const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED, SKIP_VIDEO } = SocketService_1.SOCKET_EVENT;
const videoQueue = new VideoQueue_1.VideoQueue();
const videoSearchService = new VideoSearchService_1.YTScrapeVideoSearchService(scrape_youtube_1.youtube);
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
    socket.on(SKIP_VIDEO, () => {
        console.log('skip video event triggered');
        const newVideo = videoQueue.dequeue();
        if (newVideo) {
            currentVideo = newVideo;
            io.emit(VIDEO_ENDED, newVideo);
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
app.get("/videoSearch", async (req, res) => {
    const searchTerm = req.query?.video;
    if (typeof searchTerm !== 'string') {
        res.status(400).send("Bad request");
        return;
    }
    const results = await videoSearchService.searchVideos(searchTerm);
    res.status(200).json(results);
});
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
