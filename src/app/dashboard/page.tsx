"use client";

import { useState } from "react";
import { Brain, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import NoteCard from "@/components/note-card";
import AiAssistant from "@/components/ai-assistant";
import { signOut } from "@/actions/auth";
import { useRouter } from "next/navigation";

// Sample notes data
const initialNotes = [
  {
    id: 1,
    title: "Project Deadlines",
    description:
      "Marketing campaign due on March 25th\nWebsite redesign deadline: April 10th\nQ2 planning meeting: April 15th",
    createdAt: new Date("2025-03-10T10:30:00"),
  },
  {
    id: 2,
    title: "Meeting Notes: Product Team",
    description:
      "Discussed new feature roadmap for Q2. Need to prioritize user authentication improvements and dashboard redesign.",
    createdAt: new Date("2025-03-12T14:15:00"),
  },
  {
    id: 3,
    title: "Ideas for Blog Post",
    description:
      "- AI in everyday life\n- How to improve productivity with note-taking\n- The future of personal knowledge management",
    createdAt: new Date("2025-03-15T09:45:00"),
  },
  {
    id: 4,
    title: "Book Recommendations",
    description:
      "1. Atomic Habits by James Clear\n2. Deep Work by Cal Newport\n3. The Psychology of Money by Morgan Housel",
    createdAt: new Date("2025-03-16T16:20:00"),
  },
];

export default function Dashboard() {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return;

    const note = {
      id: Date.now(),
      title: newNote.title,
      description: newNote.description,
      createdAt: new Date(),
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", description: "" });
    setIsDialogOpen(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-black p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">NoteAI</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search notes..."
                  className="pl-10 border-2 border-black rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={async () => {
                  const res = await signOut();

                  if (res.error) {
                    console.log("error signout out");
                    return;
                  }

                  router.replace("/");
                }}
                className="bg-black text-white font-bold hover:bg-black/80"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Notes</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white font-bold hover:bg-black/80 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                <Plus className="mr-2 h-5 w-5" />
                Create Note
              </Button>
            </DialogTrigger>
            <DialogContent className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0">
              <DialogHeader className="bg-black text-white p-4 rounded-t-lg">
                <DialogTitle className="text-xl font-bold">
                  Create New Note
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-bold">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter note title"
                      className="border-2 border-black rounded-lg"
                      value={newNote.title}
                      onChange={(e) =>
                        setNewNote({ ...newNote, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-bold">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter note description"
                      className="min-h-[120px] border-2 border-black rounded-lg"
                      value={newNote.description}
                      onChange={(e) =>
                        setNewNote({ ...newNote, description: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleCreateNote}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Create Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-black rounded-xl p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold mb-2">No notes found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try a different search term"
                : "Create your first note to get started"}
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Note
            </Button>
          </div>
        )}
      </main>

      {/* AI Assistant */}
      <AiAssistant />
    </div>
  );
}
