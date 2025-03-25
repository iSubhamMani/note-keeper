import { pc } from "@/lib/pinecone";
import { createClientForServer } from "@/lib/supabase/server";
import { Message } from "@/models/Message";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
const embeddingModel = ai.getGenerativeModel({
  model: "text-embedding-004",
});
const textModel = ai.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function POST(req: NextRequest) {
  const { query, history } = await req.json();
  const supabase = await createClientForServer();

  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          json: { message: "User not found" },
        },
        { status: 401 }
      );
    }

    const queryEmbedding = await embeddingModel.embedContent(query);
    const queryVector = queryEmbedding.embedding.values;

    const queryResult = await pc.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
      filter: {
        userId,
      },
    });

    /*const aboveThresholdResult = queryResult.matches?.filter(
      (match) => match.score! > 0.4
    );*/

    console.log(queryResult.matches);

    const ctx = queryResult?.matches?.map((match) => {
      return `**Title:** ${match.metadata?.title}\n**Content:** ${match.metadata?.chunk}\n`;
    });
    console.log(ctx);

    const systemPrompt = `
      You are an AI assistant who knows everything about the user's notes.
      The user has asked you a question based on their notes.
      Provide a relevant and well-structured answer to the user's question based on the context of their notes.
      If the context does not include the answer to the user's question, but if the question is related to the notes and you know the answer, provide the answer based on your knowledge.
      otherwise you can respond with a message indicating that the answer is not known to you.
      Don't include any phrases like "Based on your notes" etc. in your response.
  
      **Formatting Instructions:**
  
      * Use Markdown for formatting, including headers, bold text, and lists as needed.
      * For multiple elements (a list), use bullet points with clear formatting.
      * Ensure answers are listed in a clean, readable manner.
      * Strive for a natural, conversational tone and be respectful.
  
      -------------
      START CONTEXT
      ${ctx}
      END CONTEXT
      -------------
      QUESTION: ${query}
      -------------
  `;

    const formattedHistory = history.map((message: Message) => ({
      role: message.role,
      parts: [{ text: message.text }],
    }));

    const chat = textModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hi what can you tell me about my notes" }],
        },
        ...formattedHistory,
        {
          role: "model",
          parts: [{ text: systemPrompt }],
        },
      ],
    });

    const result = await chat.sendMessage(query);
    const response = result.response.text();

    if (!response.trim()) {
      return NextResponse.json(
        { message: "No response found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      json: { message: "Internal server error" },
    });
  }
}
