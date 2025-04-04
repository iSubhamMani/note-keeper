"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "./ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";

const CreateNoteDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [savingNote, setSavingNote] = useState(false);
  const qc = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);

  const createNote = async () => {
    if (!newNote.title.trim() || !newNote.description.trim()) {
      toast("Title and description are required", {
        position: "bottom-center",
      });
      return;
    }

    try {
      setSavingNote(true);
      const res = await axios.post("/api/note", {
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

  const handleImageUpload = async (fd: FormData) => {
    try {
      setUploadingImage(true);
      const res = await axios.post("/api/media/upload", fd);

      if (res.data.url) {
        const url = res.data.url;
        setNewNote((prev) => ({
          ...prev,
          description: prev.description + `\n\n![image](${url})`,
        }));

        toast("Image uploaded successfully", {
          position: "bottom-center",
          style: {
            backgroundColor: "#2D7DFD",
            color: "#fff",
            fontWeight: "bold",
          },
          duration: 3000,
        });
      }
    } catch (error) {
      toast(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Error uploading image",
        {
          position: "bottom-center",
          style: {
            background: "red",
            color: "white",
            fontWeight: "bold",
          },
          duration: 3000,
        }
      );
    } finally {
      setUploadingImage(false);
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
      <DialogContent
        className="border-2 border-black sm:max-w-xl md:max-w-3xl p-0"
        style={{ boxShadow: "8px 8px 0 0 #000" }}
      >
        <DialogHeader className="bg-white text-black p-4 md:px-6 rounded-t-lg">
          <DialogTitle className="text-xl font-bold">
            Create New Note
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 sm:px-4 md:px-6 pb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold pl-2">
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="description" className="pl-2 font-bold">
                  Description
                </Label>
                <Label
                  htmlFor="imageUpload"
                  className="px-2 py-1.5 text-xs sm:text-sm rounded-lg cursor-pointer max-w-[200px] border-2 border-blue-500 text-black bg-white hover:bg-gray-100 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {uploadingImage ? (
                    <div className="flex items-center gap-2">
                      <LoaderCircle className="animate-spin size-5" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </Label>
                <Input
                  onChange={(e) => {
                    const fd = new FormData();
                    if (e.target.files) {
                      fd.append("imgFile", e.target.files[0]);
                      handleImageUpload(fd);
                    }
                    e.target.files = null;
                  }}
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="container">
                <MDEditor
                  id="description"
                  className="min-h-[120px] max-h-[360px] overflow-y-auto"
                  value={newNote.description}
                  onChange={(e) =>
                    setNewNote({ ...newNote, description: e || "" })
                  }
                  height={400}
                  preview="edit"
                  textareaProps={{
                    placeholder: "Enter note description",
                  }}
                />
              </div>
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
