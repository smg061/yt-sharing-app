import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { SOCKET_EVENT } from "./SocketService";
import { Message,  } from "./types";
import { VideoQueue } from "./Models/VideoQueue";
import dotenv from 'dotenv';
import {VideoSearchService, YTScrapeVideoSearchService } from "./Services/VideoSearchService";
import { youtube as youtubeSearch } from 'scrape-youtube';

dotenv.config()

const port = process.env.PORT || "3000";

//const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const app: Express = express();
const server = http.createServer(app);

const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED, SKIP_VIDEO } = SOCKET_EVENT;
const videoQueue = new VideoQueue();

const videoSearchService: VideoSearchService  = new YTScrapeVideoSearchService(youtubeSearch)

let currentVideo: string | undefined | null = null;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const clients = new Map<string, Socket>();

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
    console.log('skip video event triggered')
    const newVideo = videoQueue.dequeue();
    if (newVideo) {
      currentVideo = newVideo;
      io.emit(VIDEO_ENDED, newVideo)
    }
  })
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
    res.status(400).send("Bad request")
    return;
  }
  const results = await videoSearchService.searchVideos(searchTerm)
  res.status(200).json(results)

})

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});