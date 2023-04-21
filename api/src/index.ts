
import { loadConfig } from "./config/loadconfig";
loadConfig();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import YTSearchService from "./Services/VideoSearchService";
import { RoomsManager } from "./Domain/Room";
import { CreateRoomRequest } from "./types";
import GPT3Tokenizer from 'gpt3-tokenizer';

import supabase, { generateEmbeddings } from "./supabase/client";
import openai from "./openai";
import { ChatCompletionRequestMessage } from "openai";
import { authMiddleWare } from "./middleware/auth";
const port = process.env.PORT || "3000";
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URI || "*",
})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  if (typeof searchTerm !== 'string') {
    res.status(400).send("Bad request")
    return;
  }
  const results = await YTSearchService.searchVideos(searchTerm)
  res.status(200).json(results)

})
app.get('/listRooms', (_, res) => {
  res.status(200).json(roomManager.listRooms())
})
app.get('/listUsers', (req, res) => {
  const roomId = req.query.roomId;
  if (typeof roomId !== 'string') {
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
})

app.post('/createRoom', (req: CreateRoomRequest, res) => {
  const { roomName } = req.body;
  if (typeof roomName !== 'string') res.sendStatus(400);
  const room = roomManager.addRoom(roomName);
  res.status(200).json({
    roomId: room.id,
  })
})

app.post('/draw/createRoom', (req: CreateRoomRequest, res) => {
  const { roomName } = req.body;
  if (typeof roomName !== 'string') res.sendStatus(400);
})

app.post('/generateEmbeddings', async (req, res) => {
  const s = await generateEmbeddings();
  res.sendStatus(200);
})

interface ProomptRequest extends Request {
  query: string;
}
app.post('/proompt', authMiddleWare, async (req, res) => {
  // Search query is passed in request payload
  const { query } = await req.body as ProomptRequest;

  return res.status(200).json({
    response:query
  })


  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, ' ')

  console.log(input)
  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input,
  })

  const [{ embedding }] = embeddingResponse.data.data
  console.log({ embedding })
  // In production we should handle possible errors

  const { data: documents, error } = await supabase
    .rpc('match_documents', {
      match_count: 10,
      query_embedding: embedding,
      similarity_threshold: 0.5,
    })
  console.log({ documents, error })

  if (error) {
    return res.status(500).json({
      error: error?.message
    })
  }
  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
  let tokenCount = 0
  let contextText = ''

  // Concat matched documents
  for (let i = 0; i < documents?.length; i++) {
    const document = documents[i]
    const content = document.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length
    // Limit context to max 1500 tokens (configurable)
    if (tokenCount > 1500) {
      break
    }
    contextText += `${content.trim()}\n---\n`
  }
  const prompt = `${`
"`}

    Context sections:
    ${contextText}

    Question: """
    ${query}
    """
  `
  const messages: ChatCompletionRequestMessage[] = [
    { role: "user", content: prompt },
    { role: "user", content: query }
  ]
  // In production we should handle possible errors
  const completionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.5, // Set to 0 for deterministic results
  })


  return res.status(200).json({
    response: completionResponse.data?.choices[0]?.message?.content
  })
})

app.post('/set-session', async (req, res) => {
  console.log(req.body.session);
  const result = await supabase.auth.setSession(req.body.session);
  console.log(result);
  res.status(200).json({});
})

server.listen(port, async () => {
  console.log(`Listening on ${port}`);
});