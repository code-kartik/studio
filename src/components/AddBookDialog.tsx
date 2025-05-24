"use client";

import { BookForm } from "@/components/BookForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Book } from "@/types";

interface AddBookDialogProps {
  onBookAdd: (data: Omit<Book, "id" | "currentPage" | "notes" | "createdAt" | "coverImageUrl">) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBookDialog({ onBookAdd, open, onOpenChange }: AddBookDialogProps) {
  const handleSubmit = (data: { title: string; author: string; totalPages: number }) => {
    onBookAdd(data);
    onOpenChange(false); // Close dialog on submit
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 fixed bottom-6 right-6 shadow-lg rounded-full p-4 h-auto md:bottom-10 md:right-10">
          <PlusCircle className="h-6 w-6 mr-2" />
          Add New Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add a New Book</DialogTitle>
        </DialogHeader>
        <BookForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
