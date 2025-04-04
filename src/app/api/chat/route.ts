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

    const aboveThresholdResult = queryResult.matches?.filter(
      (match) => match.score! > 0.4
    );

    const ctx = aboveThresholdResult.map((match) => {
      return `${match.metadata?.chunk}\n`;
    });

    const systemPrompt = `
    You are an AI assistant who knows everything about the user's notes and ongoing chat history.
    
    You can:
    - Answer questions based on the content and context of the user's notes and prior conversation.
    - Suggest improvements, additions, or recommendations that are logically or thematically related to the content in the notes (e.g., suggesting more movies if the notes contain a movie list).
    - Perform reasoning and calculations based on information from the notes (e.g., estimating total cost from a shopping list).
    - Use common knowledge **only if it directly complements the topic found in the notes or chat**.
    
    You must not:
    - Answer questions that are completely unrelated to the user's notes or the ongoing conversation.
    - Provide general knowledge answers (e.g., definitions or tutorials) unless the topic is already part of the notes or chat history.
    
    If the user's question seems unrelated or unclear, politely ask them to rephrase or clarify.
    
    **Formatting Instructions:**
    
    * Use Markdown for formatting: headers, bold text, links and lists as needed.
    * Format lists cleanly using bullet points.
    * Avoid awkward line breaks, extra commas, or symbols from the context.
    * Keep a natural, respectful, and conversational tone.
    
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
