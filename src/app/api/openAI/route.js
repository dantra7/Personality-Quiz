import { NextResponse } from 'next/server'
import OpenAI from "openai";

export async function POST(request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const data = await request.json();
    
    const prompt = `Here is some background for this prompt: The data provided is given from a user completing questions about which of two options they prefer. 
        The user had the follow list of questions: ${data.TotalOptions}. Here are the selections they picked: ${data.SelectedOptions}. Using the user's selections, 
        determine what Ben & Jerry's Ice Cream flavor the user is the most like. As well as determining the user's best fit,
        also provide a paragraph as to why the user is described by that ice cream flavor.`
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "assistant",
                content: prompt,
            },
        ],
        temperature: 1,
        max_tokens: 128,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    
    const generatedText = response.choices[0].message.content;
    return NextResponse.json({result: generatedText});
}
