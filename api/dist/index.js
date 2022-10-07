"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || "3000";
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
//cons messages: Message[] = []
io.on("connection", (socket) => {
    socket.on('message', (data) => {
        io.emit('message', data); //.emit('message', data)
    });
    socket.on("disconnect", (data) => console.log(data));
});
app.use((0, cors_1.default)({
    origin: "*",
}));
app.get("/", (req, res) => {
    console.log(req.url);
    res.send("Hello world from ts server!");
});
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
