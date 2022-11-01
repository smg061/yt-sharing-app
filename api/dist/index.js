"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const VideoSearchService_1 = require("./Services/VideoSearchService");
const scrape_youtube_1 = require("scrape-youtube");
const Room_1 = require("./Domain/Room");
dotenv_1.default.config();
const port = process.env.PORT || "3000";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URI || "*",
    },
});
const videoSearchService = new VideoSearchService_1.YTScrapeVideoSearchService(scrape_youtube_1.youtube);
const roomManager = new Room_1.RoomsManager(io);
//roomManager.addRoom('testRoom')
roomManager.listenForEvents();
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
    // room.clearQueue();
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
app.get('/listRooms', (_, res) => {
    res.status(200).json(roomManager.listRooms());
});
app.get('/listUsers', (req, res) => {
    const roomId = req.query.roomId;
    if (typeof roomId !== 'string') {
        res.sendStatus(400);
        return;
    }
    const room = roomManager.getRoomById(roomId);
    const users = room?.listUsers();
    if (users) {
        res.status(200).json(users);
    }
    else {
        res.sendStatus(404);
    }
});
app.post('/createRoom', (req, res) => {
    console.log(req.body);
    const { roomName } = req.body;
    try {
        console.log(roomName);
        const room = roomManager.addRoom(roomName);
        res.status(200).json({
            roomId: room.id,
        });
    }
    catch (e) {
        res.sendStatus(400);
        return;
    }
});
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
