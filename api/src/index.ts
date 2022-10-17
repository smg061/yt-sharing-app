import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { SOCKET_EVENT } from "./SocketService";
import { Message, VideoSearchResult } from "./types";
import { VideoQueue } from "./Models/VideoQueue";
import { toVideoResponse } from "./utils";
import fetch from 'node-fetch'
import dotenv from 'dotenv';

dotenv.config()

const port = process.env.PORT || "3000";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const app: Express = express();
const server = http.createServer(app);

const { NEW_MESSAGE, VIDEO_QUEUED, VIDEO_ENDED, SKIP_VIDEO } = SOCKET_EVENT;
const videoQueue = new VideoQueue();
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
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
app.get("/videoSearch", async (req, res) => {
  const searchTerm = req.query?.video;
  if (typeof searchTerm !== "string") {
    res.status(400).send("Bad request")
  }
  const generalSearchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&type=video&part=snippet&q=${searchTerm}`;
  const result = await fetch(generalSearchUrl)

  const data = await result.json() as { items: VideoSearchResult[], error: any }
  if (data.error) {
    // test data
    res.status(200).json(toVideoResponse(
      [
        {
          "id": {
            kind: "",
            videoId: "7lCDEYXw3mM"
          },
          "snippet": {
            "publishedAt": "2012-06-20T22:45:24.000Z",
            "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
            "title": "Google I/O 101: Q&A On Using Google APIs",
            "description": "Antonio Fuentes speaks to us and takes questions on working with Google APIs and OAuth 2.0.",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
                "width": 0,
                height: 0,

              },
              "medium": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/mqdefault.jpg",
                "width": 0,
                height: 0,
              },
              "high": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/hqdefault.jpg",
                "width": 0,
                height: 0,
              }
            },
            channelTitle: "Test Title"
          }
        },
        {
          "id": {
            kind: "",
            videoId: "7lCDEYXw3mM"
          },
          "snippet": {
            "publishedAt": "2012-06-20T22:45:24.000Z",
            "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
            "title": "Google I/O 101: Q&A On Using Google APIs",
            "description": "Antonio Fuentes speaks to us and takes questions on working with Google APIs and OAuth 2.0.",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
                "width": 0,
                height: 0,

              },
              "medium": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/mqdefault.jpg",
                "width": 0,
                height: 0,
              },
              "high": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/hqdefault.jpg",
                "width": 0,
                height: 0,
              }
            },
            channelTitle: "Test Title"
          }
        },
        {
          "id": {
            kind: "",
            videoId: "7lCDEYXw3mM"
          },
          "snippet": {
            "publishedAt": "2012-06-20T22:45:24.000Z",
            "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
            "title": "Google I/O 101: Q&A On Using Google APIs",
            "description": "Antonio Fuentes speaks to us and takes questions on working with Google APIs and OAuth 2.0.",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
                "width": 0,
                height: 0,

              },
              "medium": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/mqdefault.jpg",
                "width": 0,
                height: 0,
              },
              "high": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/hqdefault.jpg",
                "width": 0,
                height: 0,
              }
            },
            channelTitle: "Test Title"
          }
        },{
          "id": {
            kind: "",
            videoId: "7lCDEYXw3mM"
          },
          "snippet": {
            "publishedAt": "2012-06-20T22:45:24.000Z",
            "channelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
            "title": "Google I/O 101: Q&A On Using Google APIs",
            "description": "Antonio Fuentes speaks to us and takes questions on working with Google APIs and OAuth 2.0.",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg",
                "width": 0,
                height: 0,

              },
              "medium": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/mqdefault.jpg",
                "width": 0,
                height: 0,
              },
              "high": {
                "url": "https://i.ytimg.com/vi/7lCDEYXw3mM/hqdefault.jpg",
                "width": 0,
                height: 0,
              }
            },
            channelTitle: "Test Title"
          }
        }
      ]))
      return
  }
  res.status(200).json(toVideoResponse(data.items))

})