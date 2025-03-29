"use client";

import {
  Calendar,
  Clock,
  LoaderCircleIcon,
  MoreHorizontal,
} from "lucide-react";
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

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const [deleting, setDeleting] = useState(false);
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`${getRandomColor()} border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold line-clamp-1">
            {JSON.parse(content).title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-2 border-black">
              <DropdownMenuItem className="cursor-pointer font-medium ">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={deleting}
                onClick={handleDelete}
                className="text-red-600 font-medium cursor-pointer"
              >
                {deleting ? (
                  <LoaderCircleIcon className="size-4 animate-spin text-black" />
                ) : (
                  "Delete"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="min-h-[100px] mb-4">
          <p className="text-gray-700 whitespace-pre-line line-clamp-4">
            {JSON.parse(content).description}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(new Date(note.created_at))}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatTime(new Date(note.created_at))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
