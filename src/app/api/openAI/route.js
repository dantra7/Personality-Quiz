import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const data = await request.json();
    
    const prompt = `For context, in Avatar the Last Airbender, there are four elements which 
      people can "bend", or control. The four elements are water, earth, fire, and air. The
      four elements each correspond to character traits within a person, which I will provide below:
      Earth Benders are patient, stubborn, grounded, and strong-willed. Fire benders are prideful, 
      passionate, determined, and loyal. Air benders are gentle, creative, playful, and quick thinkers. 
      Water benders are calm, collected, flexible, and content.
      If someone identifies themselves as more ${pairedOptions
      .map(({ selected, notSelected }) => `${selected} than ${notSelected}`)
      .join(', ')}, what 'bender' are they the most similar to? Water, Earth, Fire, or Air?`;
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
