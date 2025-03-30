"use client";

import { LoaderCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@/models/Note";
import axios from "axios";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { format } from "date-fns";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [editNote, setEditNote] = useState({
    title: JSON.parse(note.content).title || "",
    description: JSON.parse(note.content).description || "",
  });
  const qc = useQueryClient();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Generate a random pastel color for the card
  const getRandomColor = () => {
    const colors = [
      "bg-yellow-100 border-yellow-300",
      "bg-blue-100 border-blue-300",
      "bg-green-100 border-green-300",
      "bg-pink-100 border-pink-300",
      "bg-purple-100 border-purple-300",
      "bg-orange-100 border-orange-300",
    ];

    // Use the note id to pick a color (ensures consistency for the same note)
    return colors[Math.abs(note.id.charCodeAt(0) % colors.length)];
  };

  const { content } = note;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await axios.delete(`/api/note?id=${note.id}`);

      if (res.data.success) {
        qc.invalidateQueries({
          queryKey: ["notes"],
          exact: true,
        });
        toast("Note deleted", {
          position: "bottom-center",
          duration: 3000,
          style: {
            backgroundColor: "#2D7DFD",
            color: "#fff",
            fontWeight: "bold",
          },
        });
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast("Error deleting note", {
        position: "bottom-center",
        duration: 3000,
        style: {
          backgroundColor: "#FF0000",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editNote.title.trim() || !editNote.description.trim()) {
      toast("Title and description are required", {
        position: "bottom-center",
      });
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.patch(`/api/note?id=${note.id}`, {
        note: JSON.stringify({
          title: editNote.title,
          description: editNote.description,
        }),
      });

      if (res.data.success) {
        qc.invalidateQueries({
          queryKey: ["notes"],
          exact: true,
        });
        toast("Note updated", {
          position: "bottom-center",
          duration: 3000,
          style: {
            backgroundColor: "#2D7DFD",
            color: "#fff",
            fontWeight: "bold",
          },
        });
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast("Error updating note", {
        position: "bottom-center",
        duration: 3000,
        style: {
          backgroundColor: "#FF0000",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Card
        className={`relative p-6 cursor-pointer transition-transform hover:translate-x-1 hover:translate-y-1 bg-white border-2 ${getRandomColor()}`}
        style={{
          boxShadow: "4px 4px 0 0 #000",
        }}
        onClick={() => setIsDetailsOpen(true)}
      >
        <div
          className="absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-bold text-xl mb-2">{JSON.parse(content).title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {JSON.parse(content).description}
        </p>
        <div className="text-sm text-gray-500">
          {formatDate(new Date(note.created_at))} •{" "}
          {formatTime(new Date(note.created_at))}
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent
          className="border-2 border-black"
          style={{ boxShadow: "8px 8px 0 0 #000" }}
        >
          <DialogHeader>
            <DialogTitle>{JSON.parse(note.content).title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-gray-600 whitespace-pre-wrap">
              {JSON.parse(note.content).description}
            </p>
            <p className="text-sm text-gray-500">
              Created on {format(note.created_at, "MMMM d, yyyy")} at{" "}
              {format(note.created_at, "h:mm a")}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="border-2 border-black"
          style={{ boxShadow: "8px 8px 0 0 #000" }}
        >
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={editNote.title}
                onChange={(e) =>
                  setEditNote({ ...editNote, title: e.target.value })
                }
                placeholder="Note title"
                className="border-2 border-black"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                value={editNote.description}
                onChange={(e) =>
                  setEditNote({ ...editNote, description: e.target.value })
                }
                placeholder="Note description"
                className="min-h-[150px] border-2 border-black"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={updating}
              onClick={handleUpdate}
              className="bg-black text-white hover:bg-gray-800 border-2 border-black"
              style={{ boxShadow: "4px 4px 0 0 #000" }}
            >
              {updating ? (
                <div className="flex items-center gap-2">
                  Saving...this may take some time{" "}
                  <LoaderCircle className="size-5 animate-spin" />
                </div>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent
          className="border-2 border-black"
          style={{ boxShadow: "8px 8px 0 0 #000" }}
        >
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-2 border-black"
              style={{ boxShadow: "4px 4px 0 0 #000" }}
            >
              Cancel
            </Button>
            <Button
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-2 border-black"
              style={{ boxShadow: "4px 4px 0 0 #000" }}
            >
              {deleting ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
