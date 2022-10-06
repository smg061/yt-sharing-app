"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const port = process.env.PORT || "3000";
app.get('/', (req, res) => {
    console.log(req);
    res.send("Hello world from ts server!");
});
io.on('connection', (socket) => {
    console.log(socket);
});
app.listen(port, () => {
    console.log(`Listeing on ${port}`);
});
