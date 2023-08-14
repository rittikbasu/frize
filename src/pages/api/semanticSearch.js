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
        const { data: documents } = await supabase.rpc('match_timelogs', {
            query_embedding: embedding,
            match_threshold: 0.81, // Choose an appropriate threshold for your data
            match_count: 30, // Choose the number of matches
        })
        console.log(documents)

        if (documents.length === 0) {
            return res.status(200).json([])
        }
        let tokenCount = 0
        let contextText = ''

        // Concat matched documents
        for (let i = 0; i < documents.length; i++) {
            const document = documents[i]
            const content = document.gpt_context
            const encoded = encode(content)
            tokenCount += encoded.length
            console.log(encoded.length)

            // Limit context to max 1500 tokens (configurable)
            // if (tokenCount > 5000) {
            // break
            // }

            contextText += `${content.trim()}\n---\n`
        }

        const systemPrompt = `
            You are a question answering model that answers questions based on the content of the time sheet that contains a breakdown of time spent on different tasks during the day and the categories of the tasks. Don't show any calculations just the final answer. Given the following data from the document, answer the question using only that information, outputted in html and formatted appropriately.`
        
        const userPrompt = `
            Context sections:
            ${contextText}

            Question: """
            ${query}
            """

            Answer as html:
        `
        // get total count of tokens in systemPrompt and userPrompt
        const systemPromptTokens = encode(systemPrompt).length
        const userPromptTokens = encode(userPrompt).length
        const totalTokens = systemPromptTokens + userPromptTokens
        console.log(totalTokens)

        let model = "gpt-3.5-turbo"

        if (totalTokens > 4000) {
            model = "gpt-3.5-turbo-16k"
        }
        console.log(model)
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
