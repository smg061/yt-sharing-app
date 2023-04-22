import express from 'express';
import supabase from '../supabase/client';
import { authMiddleWare } from '../middleware/auth';
import openai from '../openai';
import { ChatCompletionRequestMessage } from 'openai';
import GPT3Tokenizer from 'gpt3-tokenizer';

const router = express.Router();

async function getDocuments() {
    return [
        'You are sweet old lady. All numbers are commafied, and you talk in rhyme, all the time',
        'I am your grandson, and I am a robot. I am a robot, and I am your grandson',
        'I am a robot, and I am your grandson. I am your grandson, and I am a robot',
    ]
}

export async function generateEmbeddings() {

    const documents = await getDocuments() // Your custom function to load docs
    console.log(process.env.OPENAI_API_KEY)
    // Assuming each document is a string
    for (const document of documents) {
        // OpenAI recommends replacing newlines with spaces for best results
        const input = document.replace(/\n/g, ' ')
        try {
            const embeddingResponse = await openai.createEmbedding({
                model: 'text-embedding-ada-002',
                input,
            })
            const [{ embedding }] = embeddingResponse.data.data

            const result = await supabase.from('documents').insert({
                content: document,
                embedding,
            })
            console.log(result)

        } catch (error) {
            console.log(error)
        }
    }
}

async function generateEmbedding(input: string) {
    // OpenAI recommends replacing newlines with spaces for best results
    input = input.replace(/\n/g, ' ')
    const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input,
    })
    const [{ embedding }] = embeddingResponse.data.data
    return embedding
}


router.post('/saveEmbedding', async (req, res) => {
    const { query } = await req.body as ProomptRequest;
    const embedding = await generateEmbedding(query);
    const result = await supabase.from('documents').insert({
        content: query,
        embedding,
    })
    console.log(result)
    res.sendStatus(200);
})
router.post('/generateEmbeddings', async (req, res) => {
    const s = await generateEmbeddings();
    res.sendStatus(200);
})

interface ProomptRequest extends Request {
    query: string;
}

const previousPrompts: ChatCompletionRequestMessage[] = [];

router.post('/prompt-stream', async (req, res) => {
    console.log('prompt-stream')
    const { query } = await req.body as ProomptRequest;
    const prompt = query.replace(/\n/g, ' ');
    console.log(prompt)
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive'
    });
    res.flushHeaders();
    res.write('retry: 10000\n\n');


    const data = `data: ${prompt}

    `;
    res.write(data);
    res.end();
})
router.post('/', async (req, res) => {
    // Search query is passed in request payload
    const { query } = await req.body as ProomptRequest;


    // OpenAI recommends replacing newlines with spaces for best results
    const input = query.replace(/\n/g, ' ')

    // Generate a one-time embedding for the query itself
    const embeddingResponse = await openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input,
    })

    const [{ embedding }] = embeddingResponse.data.data

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
        You are a writing assistant that helps people stories. The genre is Japanese visual novel. You suggestions should align with the genre.
        You are to assist in writing compelling stories and characters. There is a database of previous conversations 
        that may be used to help you. If the context section is empty, you are to preface your response with "No previous context was found". 

      Context sections:
      ${contextText}
  
      Question: """
      ${query}
      """
    `
    previousPrompts.push({ role: "user", content: prompt }, { role: "user", content: query })


    // In production we should handle possible errors
    const completionResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: previousPrompts,
        temperature: 0.4, // Set to 0 for deterministic results
    })

    const response = completionResponse.data?.choices[0]?.message?.content;
    if(!response) {
        return res.status(500).json({
            error: "No response was generated"
        })
    }

    previousPrompts.push({ role: "assistant", content: response })

    console.log(previousPrompts);
    
    return res.status(200).json({
        response
    })
})



export default router;