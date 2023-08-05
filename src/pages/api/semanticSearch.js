import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from 'openai'
import { encode } from 'gpt-3-encoder'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Search query is passed in request body
        const { query } = req.body

        // OpenAI recommends replacing newlines with spaces for best results
        const input = query.replace(/\n/g, ' ')

        const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY }) // Set your OpenAI key as an environment variable
        const openai = new OpenAIApi(configuration)

        // Generate a one-time embedding for the query itself
        const embeddingResponse = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input,
        })

        const [{ embedding }] = embeddingResponse.data.data

        // In production, you should handle possible errors here
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY) // Set your Supabase URL and key as environment variables
        const { data: documents } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.80, // Choose an appropriate threshold for your data
            match_count: 5, // Choose the number of matchesf
        })
        console.log(documents)

        let tokenCount = 0
        let contextText = ''

        // Concat matched documents
        for (let i = 0; i < documents.length; i++) {
            const document = documents[i]
            const content = document.raw_data
            const encoded = encode(content)
            tokenCount += encoded.length
            console.log(tokenCount)

            // Limit context to max 1500 tokens (configurable)
            if (tokenCount > 5000) {
            break
            }

            contextText += `${content.trim()}\n---\n`
        }

        const systemPrompt = `
            You are a question answering model that answers questions based on the content of the document that contains a breakdown of time spent on different tasks during the day and the categories of the tasks. Given the following sections from the document, answer the question using only that information, outputted in markdown format.`
        
        const userPrompt = `
            Context sections:
            ${contextText}

            Question: """
            ${query}
            """

            Answer as markdown:
        `

        // const prompt = stripIndent`${oneLine`
        //     You are a question answering model that answers questions based on the content of the document that contains a breakdown of time spent on different tasks during the day and the categories of the tasks. Given the following sections from the document, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't the answer to that :(."`}

        //     Context sections:
        //     ${contextText}

        //     Question: """
        //     ${query}
        //     """

        //     Answer as markdown:
        // `

        // In production we should handle possible errors
        const completionResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {role: 'system', content: systemPrompt},
                {role: 'user', content: userPrompt},
            ],
        })
        // if (error) {
        //     console.log(completionResponse.data.error)
        // } else {
        //     console.log(completionResponse.data)
        // }
        // console.log(completionResponse)

        res.status(200).json(JSON.stringify(completionResponse.data))
    }
}
