import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || "3000";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
type Message = { user: string; userId: string; content: string };

//cons messages: Message[] = []
io.on("connection", (socket) => {
  socket.on('message', (data: Message)=> {
    io.emit('message',data)//.emit('message', data)
  })
  socket.on("disconnect", (data) => console.log(data));
});

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req: Request, res: Response) => {
  console.log(req.url);
  res.send("Hello world from ts server!");
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
