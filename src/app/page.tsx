"use client";

import { useState, useEffect } from "react";
import type { Book } from "@/types";
import { Header } from "@/components/Header";
import { BookCard } from "@/components/BookCard";
import { AddBookDialog } from "@/components/AddBookDialog";
import { BookDetailsDialog } from "@/components/BookDetailsDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, SearchX } from "lucide-react";

const LOCAL_STORAGE_KEY = "lexiTrackBooks";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailsDialogOpen, setIsBookDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (error) {
      console.error("Failed to load books from localStorage", error);
      toast({
        title: "Error",
        description: "Could not load your saved books.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    if (!isLoading) { // Only save to localStorage after initial load
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
      } catch (error) {
        console.error("Failed to save books to localStorage", error);
        toast({
          title: "Error",
          description: "Could not save your book changes.",
          variant: "destructive",
        });
      }
    }
  }, [books, isLoading, toast]);

  const handleAddBook = (data: Omit<Book, "id" | "currentPage" | "notes" | "createdAt" | "coverImageUrl">) => {
    const newBook: Book = {
      ...data,
      id: crypto.randomUUID(),
      currentPage: 0,
      notes: "",
      createdAt: new Date().toISOString(),
      coverImageUrl: `https://placehold.co/150x200.png?text=${encodeURIComponent(data.title.substring(0,15))}` 
    };
    setBooks((prevBooks) => [newBook, ...prevBooks]);
    toast({
      title: "Book Added!",
      description: `${newBook.title} has been added to your library.`,
    });
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === updatedBook.id ? updatedBook : b))
    );
    // Toast is handled within BookDetailsDialog for specific save
  };

  const handleDeleteBook = (bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    setBooks((prevBooks) => prevBooks.filter((b) => b.id !== bookId));
    if (bookToDelete) {
      toast({
        title: "Book Deleted",
        description: `${bookToDelete.title} has been removed from your library.`,
        variant: "destructive"
      });
    }
  };

  const openBookDetails = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-muted-foreground">Loading your library...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <SearchX className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Your Library is Empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              It looks like you haven't added any books yet. Start building your reading list!
            </p>
            <Button onClick={() => setIsAddBookDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Book
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpenDetails={openBookDetails}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>

      <AddBookDialog
        onBookAdd={handleAddBook}
        open={isAddBookDialogOpen}
        onOpenChange={setIsAddBookDialogOpen}
      />
      
      {selectedBook && (
        <BookDetailsDialog
          book={selectedBook}
          open={isBookDetailsDialogOpen}
          onOpenChange={setIsBookDetailsDialogOpen}
          onUpdateBook={handleUpdateBook}
        />
      )}
    </div>
  );
}
