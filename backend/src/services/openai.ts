import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(message: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a cybersecurity assistant." },
      { role: "user", content: message }
    ],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
}
