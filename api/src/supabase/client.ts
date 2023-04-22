import { createClient } from '@supabase/supabase-js'
import openai from '../openai'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY


if (!supabaseKey) throw new Error('No supabase key found')

if (!supabaseUrl) throw new Error('No supabase url found')

const supabase = createClient(supabaseUrl, supabaseKey,
)


export default supabase

