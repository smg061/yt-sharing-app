import { createClient } from '@supabase/supabase-js'
import openai from '../openai'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY


if (!supabaseKey) throw new Error('No supabase key found')

if (!supabaseUrl) throw new Error('No supabase url found')

const supabase = createClient(supabaseUrl, supabaseKey,
)


export default supabase

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