import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Queue } from "./Queue";
import { SOCKET_EVENT } from "./SocketService";
const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || "3000";

const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED } = SOCKET_EVENT;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
type Message = { user: string; userId: string; content: string };

const videoQueue = new Queue<string>();
let currentVideo: string;
io.on("connection", (socket) => {
  if(currentVideo) {
    socket.emit(VIDEO_ENDED, currentVideo )
  }
  socket.on(NEW_MESSAGE, (data: Message) => {
    io.emit(NEW_MESSAGE, data);
  });
  socket.on(VIDEO_QUEUED, (data: { previousUrl: string; newUrl: string }) => {
    if (!data.previousUrl && data.newUrl!=='') {
      io.emit(VIDEO_ENDED, data.newUrl);
      currentVideo = data.newUrl
      return
    }
    console.log("video received", data);
    videoQueue.enqueue(data.newUrl);
    io.emit(VIDEO_QUEUED, data.newUrl);
  });
  socket.on(VIDEO_ENDED, () => {
    const url = videoQueue.dequeue();
    if(typeof url !=='undefined') {
      currentVideo = url;
      io.emit(VIDEO_ENDED, url);
    }
  });
  socket.on("disconnect", (data) => console.log(data));
});

app.use(
  cors({
    origin: process.env.CLIENT_URI || "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  console.log(req.url);
  res.send("Hello world from ts server!");
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
