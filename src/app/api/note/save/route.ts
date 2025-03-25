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
  const { note } = await req.json();
  const { description, title } = note;

  if (!title.trim() || !description.trim()) {
    return NextResponse.json(
      { message: "Title and content is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClientForServer();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 401 }
      );
    }

    // Save the embeddings
    const id = uuidv4();
    const chunks = chunkText(description, CHUNK_SIZE);
    const embeddings = await getEmbeddingsForChunks(chunks);

    const vectors = embeddings.map((embedding, i) => ({
      id,
      values: embedding,
      metadata: {
        chunk: chunks[i],
        userId,
        title,
      },
    }));

    await pc.upsert(vectors);

    const { error } = await supabase.from("notes").insert({
      content: JSON.stringify(note),
      created_by: userId,
      id,
    });

    if (error)
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 }
      );

    return NextResponse.json(
      { message: "Note saved successfully", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Note save failed:", error);
    return NextResponse.json(
      { message: "Error saving embeddings" },
      { status: 500 }
    );
  }
}
