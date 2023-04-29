import { loadConfig } from "./config/loadconfig";
loadConfig();


import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import YTSearchService from "./Services/VideoSearchService";
import { RoomsManager } from "./Domain/Room";
import { CreateRoomRequest } from "./types";
import promptRouter from "./controllers/prompt";
import { authMiddleWare } from "./middleware/auth";

const port = process.env.PORT || "3000";
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URI || "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/prompt", authMiddleWare, promptRouter);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URI || "*",
  },
});

const roomManager = new RoomsManager(io);

roomManager.listenForEvents();

app.get("/", (_, res) => {
  res.send("Hello world from ts server!");
});

app.get("/health", (_, res) => {
  res.status(200).send("All green!");
});

app.get("/clearQueue", (_, res) => {
  res.status(200).send("Queue cleared!");
});

app.get("/videoSearch", async (req, res) => {
  const searchTerm = req.query?.video;
  if (typeof searchTerm !== "string") {
    res.status(400).send("Bad request");
    return;
  }
  const results = await YTSearchService.searchVideos(searchTerm);
  res.status(200).json(results);
});

app.get("/listRooms", (_, res) => {
  res.status(200).json(roomManager.listRooms());
});

app.get("/listUsers", (req, res) => {
  const roomId = req.query.roomId;
  if (typeof roomId !== "string") {
    res.sendStatus(400);
    return;
  }
  const room = roomManager.getRoomById(roomId);
  const users = room?.listUsers();
  if (users) {
    res.status(200).json(users);
  } else {
    res.sendStatus(404);
  }
});

app.post("/createRoom", (req: CreateRoomRequest, res) => {
  const { roomName } = req.body;
  if (typeof roomName !== "string") res.sendStatus(400);
  const room = roomManager.addRoom(roomName);
  res.status(200).json({
    roomId: room.id,
  });
});

app.post("/draw/createRoom", (req: CreateRoomRequest, res) => {
  const { roomName } = req.body;
  if (typeof roomName !== "string") res.sendStatus(400);
});

server.listen(port, async () => {
  console.log(`Listening on ${port}`);
});
