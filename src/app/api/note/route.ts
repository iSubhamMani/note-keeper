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

    const id = uuidv4();

    const { error } = await supabase
      .from("notes")
      .insert({
        content: JSON.stringify(note),
        created_by: userId,
        id,
      })
      .single();

    if (error)
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 }
      );

    // Save the embeddings

    try {
      const fullContent = `${title}: ${description}`;
      const chunks = chunkText(fullContent, CHUNK_SIZE);
      const embeddings = await getEmbeddingsForChunks(chunks);

      const vectors = embeddings.map((embedding, i) => ({
        id,
        values: embedding,
        metadata: {
          chunk: chunks[i],
          userId,
        },
      }));

      await pc.upsert(vectors);
    } catch {
      console.error("Error saving embeddings:", error);
      // Rollback: Delete the note from Supabase
      await supabase.from("notes").delete().eq("id", id);
      return NextResponse.json(
        { message: "Error saving embeddings" },
        { status: 500 }
      );
    }

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

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const noteId = url.searchParams.get("id") as string;

  if (!noteId) {
    return NextResponse.json(
      { message: "NoteId is required", success: false },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClientForServer();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 401 }
      );
    }

    // Check if the note exists before deletion
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("id, content, created_by, created_at")
      .eq("id", noteId)
      .eq("created_by", userId)
      .single();

    if (fetchError || !existingNote) {
      return NextResponse.json(
        { message: "Note not found or unauthorized", success: false },
        { status: 404 }
      );
    }

    // Step 1: Delete from Supabase
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (deleteError) {
      return NextResponse.json(
        { message: deleteError.message, success: false },
        { status: 400 }
      );
    }

    // Step 2: Delete from Pinecone
    try {
      await pc.deleteOne(noteId);
    } catch (pineconeError) {
      console.error("Pinecone deletion failed:", pineconeError);

      // Rollback: Restore the note in Supabase
      await supabase.from("notes").insert(existingNote);

      return NextResponse.json(
        {
          message: "Pinecone deletion failed. Rolling back Supabase deletion.",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Note deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Error deleting note", success: false },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url);
  const noteId = url.searchParams.get("id") as string;
  let { note } = await req.json();
  note = JSON.parse(note);

  if (!noteId || !note) {
    return NextResponse.json(
      { message: "Note Id or note content is missing", success: false },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClientForServer();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 401 }
      );
    }

    // Check if the note exists before updation
    const { data: existingNote, error: fetchError } = await supabase
      .from("notes")
      .select("id, content, created_by, created_at")
      .eq("id", noteId)
      .eq("created_by", userId)
      .single();

    if (fetchError || !existingNote) {
      return NextResponse.json(
        { message: "Note not found or unauthorized", success: false },
        { status: 404 }
      );
    }

    // Step 1: Update in Supabase
    const { error: updateError } = await supabase
      .from("notes")
      .update({
        content: JSON.stringify(note),
      })
      .eq("id", noteId);

    if (updateError) {
      return NextResponse.json(
        { message: updateError.message, success: false },
        { status: 400 }
      );
    }

    // Step 2: Update in Pinecone
    try {
      const fullContent = `${note.title}: ${note.description}`;
      const chunks = chunkText(fullContent, CHUNK_SIZE);
      const embeddings = await getEmbeddingsForChunks(chunks);

      const vectors = embeddings.map((embedding, i) => ({
        id: noteId,
        values: embedding,
        metadata: {
          chunk: chunks[i],
          userId,
        },
      }));

      await pc.upsert(vectors);
    } catch (pineconeError) {
      console.error("Pinecone updation failed:", pineconeError);

      // Rollback: Restore the note in Supabase
      await supabase
        .from("notes")
        .update({
          content: existingNote.content,
        })
        .eq("id", noteId);

      return NextResponse.json(
        {
          message: "Pinecone updation failed. Rolling back Supabase deletion.",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Note updated successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Error updating note", success: false },
      { status: 500 }
    );
  }
}
