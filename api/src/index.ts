import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv';
import { VideoSearchService, YTScrapeVideoSearchService } from "./Services/VideoSearchService";
import { youtube as youtubeSearch } from 'scrape-youtube';
import { Room } from "./Models/Room";

dotenv.config()

const port = process.env.PORT || "3000";
const app: Express = express();
const server = http.createServer(app);
const videoSearchService: VideoSearchService = new YTScrapeVideoSearchService(youtubeSearch)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URI || "*",
  },
});

const room = new Room("testRoom", io)
//const clients = new Map<string, Socket>();


room.listenForEvents()

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
  room.clearQueue();
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