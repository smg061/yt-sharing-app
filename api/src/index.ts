import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Queue } from "./Queue";
import { SOCKET_EVENT } from "./SocketService";
import { Message } from "./Models";


const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || "3000";

const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED } = SOCKET_EVENT;
const videoQueue = new Queue<string>();
let currentVideo: string | undefined | null = null;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


io.on("connection", (socket) => {
  if (currentVideo) {
    socket.emit(VIDEO_ENDED, currentVideo);
  }
  socket.on(NEW_MESSAGE, (data: Message) => {
    io.emit(NEW_MESSAGE, data);
  });
  socket.on(VIDEO_QUEUED, (data: string) => {
    if (currentVideo === null || currentVideo === undefined) {
      console.log('no more videos, directly sending current video', data)
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

app.use(
  cors({
    origin: process.env.CLIENT_URI || "*",
  })
);

app.get("/", (_: Request, res: Response) => {
  res.send("Hello world from ts server!");
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
