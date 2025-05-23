"use client";

import { LoaderCircle } from "lucide-react";
import NoteCard from "@/components/note-card";
import AiAssistant from "@/components/ai-assistant";
import LogoutButton from "@/components/logout-button";
import CreateNoteDialog from "@/components/create-note-dialog";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabase/client";
import Image from "next/image";

async function getNotes() {
  const {
    data: { user },
  } = await supabaseClient().auth.getUser();

  const { data, error } = await supabaseClient()
    .from("notes")
    .select("*")
    .eq("created_by", user?.id);

  if (error) throw new Error(error.message);

  return data;
}

export default function Dashboard() {
  const {
    data: notes,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-10">
                <Image
                  src={"/logo.jpeg"}
                  alt="Note Keeper Logo"
                  width={48}
                  height={48}
                  className="w-full h-full"
                />
              </div>
              <span className="text-xl font-bold">Note Keeper</span>
            </div>

            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Notes</h1>
          <CreateNoteDialog />
        </div>
        {isError && (
          <div className="flex justify-center my-6">
            <p className="text-lg text-red-600 font-bold">
              An error occurred while fetching notes.
            </p>
          </div>
        )}
        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="flex justify-center my-6">
            <LoaderCircle className="animate-spin h-6 w-6 text-blue-500" />
          </div>
        )}
        {/* Notes Grid */}
        {notes?.length === 0 && (
          <div className="mt-20">
            <p className="text-lg text-center text-gray-700 font-bold">
              No notes found
            </p>
            <p className="text-center text-sm text-gray-500 font-medium">
              Get started by creating one
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes?.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </main>

      <AiAssistant />
    </div>
  );
}
