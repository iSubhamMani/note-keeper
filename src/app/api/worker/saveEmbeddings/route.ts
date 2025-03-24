/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClientForServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { pc } from "@/lib/pinecone";

function chunkText(text: string, size: number): string[] {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + size;
    let chunk = text.slice(start, end);

    // try not to cut off mid-sentence
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf(".");
      if (lastPeriod !== -1) {
        end = start + lastPeriod + 1;
        chunk = text.slice(start, end);
      }
    }

    chunks.push(chunk.trim());
    start = end;
  }

  return chunks;
}

async function getEmbeddingsForChunks(chunks: string[]) {
  const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);
  const model = ai.getGenerativeModel({
    model: "text-embedding-004",
  });

  const res = [];

  for (const chunk of chunks) {
    const result = await model.embedContent(chunk);
    const vector = result.embedding.values;
    res.push(vector);
  }

  return res;
}

const CHUNK_SIZE = 300;

export async function POST(req: NextRequest) {
  const { noteContent } = await req.json();

  if (!noteContent.trim()) {
    return NextResponse.json({
      status: 400,
      json: { message: "Title is required" },
    });
  }

  const supabase = await createClientForServer();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return NextResponse.json({
      status: 401,
      json: { message: "User not found" },
    });
  }

  // Save the embeddings
  try {
    const chunks = chunkText(noteContent, CHUNK_SIZE);
    const embeddings = await getEmbeddingsForChunks(chunks);

    const vectors = embeddings.map((embedding, i) => ({
      id: uuidv4(),
      values: embedding,
      metadata: {
        chunk: chunks[i],
        userId,
      },
    }));

    await pc.upsert(vectors);

    return NextResponse.json(
      { message: "Embeddings saved successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Embedding save failed:", error);
    return NextResponse.json(
      { message: "Error saving embeddings" },
      { status: 500 }
    );
  }
}
