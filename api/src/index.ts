import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
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

const clients = new Map<string, Socket>();

const videoQueue = new Queue<string>();
let currentVideo: string | undefined | null = null;
io.on("connection", (socket) => {
  clients.set(socket.id, socket);
  
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
    console.log("video queue", data, videoQueue.getItems());
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
app.get('/health', (_, res)=> {
  res.status(200).send("All green!")
})
app.get('/clearQueue', (_, res)=> {
  currentVideo = null;
  for (let i = 0; i < videoQueue.getItems().length; i++) {
    videoQueue.dequeue()
  }
  res.status(200).send("Queue cleared!")
})
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
