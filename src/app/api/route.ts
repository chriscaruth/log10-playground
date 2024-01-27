import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai"

const openAI = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

export const runtime = 'edge';

interface OpenAIConfig {
    model: string;
    temperature: number
}

interface OpenAIRequest {
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    config: OpenAIConfig;
}

export const POST = async (req: Request) => {
    try {
        const { 
            messages, 
            config: { 
                model,
                temperature
            } 
        } = await req.json() as OpenAIRequest;
    
        const response = await openAI.chat.completions.create({
            messages,
            model,
            stream: true,
            temperature
        });
    
        const stream = OpenAIStream(response);
    
        return new StreamingTextResponse(stream);
    }
    catch (e) {
        return new Response("Error");
    }
}
