"use client";

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
import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const CreateNoteDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [savingNote, setSavingNote] = useState(false);
  const qc = useQueryClient();

  const createNote = async () => {
    if (!newNote.title.trim()) {
      return;
    }

    try {
      setSavingNote(true);
      const res = await axios.post("/api/note/save", {
        note: newNote,
      });

      if (res.data.success) {
        qc.invalidateQueries({ queryKey: ["notes"], exact: true });
        setIsDialogOpen(false);
        setNewNote({ title: "", description: "" });
      }
    } catch {
      console.error("Error saving note");
    } finally {
      setSavingNote(false);
    }
  };

  return (
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
                maxLength={40}
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
                className="min-h-[120px] max-h-[260px] overflow-y-auto border-2 border-black rounded-lg"
                value={newNote.description}
                onChange={(e) =>
                  setNewNote({ ...newNote, description: e.target.value })
                }
              />
            </div>
            <Button
              disabled={savingNote}
              onClick={createNote}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {savingNote ? (
                <div className="flex items-center gap-4">
                  <LoaderCircle className="animate-spin size-5" />
                  <span>Saving...this may take some time</span>
                </div>
              ) : (
                "Create Note"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
