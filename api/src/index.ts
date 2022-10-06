import express, {Express, Request, Response} from 'express';
import http from 'http';
import {Server} from 'socket.io';


const app : Express = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || "3000";

app.get('/', (req: Request, res: Response)=> {
    console.log(req)
    res.send("Hello world from ts server!")
})

io.on('connection', (socket)=> {
    console.log(socket)
})

app.listen(port, ()=> {
    console.log(`Listencing on ${port}`)
})
