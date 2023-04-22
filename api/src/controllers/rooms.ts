import express from "express";

const router = express.Router();

// router.get("/", (_, res) => {
//     res.send("Hello world from ts server!");
//     }
// );

// router.get("/health", (_, res) => {
//     res.status(200).send("All green!");
//     }
// );

// router.get("/clearQueue", (_, res) => {
//     res.status(200).send("Queue cleared!");
//     }
// );

// router.get("/videoSearch", async (req, res) => {
//     const searchTerm = req.query?.video;
//     if (typeof searchTerm !== 'string') {
//         res.status(400).send("Bad request")
//         return;
//     }
//     const results = await YTSearchService.searchVideos(searchTerm)
//     res.status(200).json(results)
//     }
// );

// router.get('/listRooms', (_, res) => {
//     res.status(200).json(roomManager.listRooms())
//     }
// );

// router.get('/listUsers', (req, res) => {
//     const roomId = req.query.roomId;
//     if (typeof roomId !== 'string') {
//         res.sendStatus(400);
//         return;
//     }
//     const room = roomManager.getRoomById(roomId);
//     const users = room?.listUsers();
//     if (users) {
//         res.status(200).json(users);
//     } else {
//         res.sendStatus(404);
//     }
//     }
// );

// router.post('/createRoom', (req: CreateRoomRequest, res) => {
//     const { roomName } = req.body;
//     if (typeof roomName !== 'string') res.sendStatus(400);
//     const room = roomManager.addRoom(roomName);
//     res.status(200).json({
//         roomId: room.id,
//     })
//     }
// );


// router.post('/draw/createRoom', (req: CreateRoomRequest, res) => {
//     const { roomName } = req.body;
//     if (typeof roomName !== 'string') res.sendStatus(400);
//     }
// );

export default router;