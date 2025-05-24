"use client";

import type { Book } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import Image from "next/image";
import { enhanceNotes } from '@/ai/flows/enhance-notes';
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Save, Loader2, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookDetailsDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateBook: (book: Book) => void;
}

export function BookDetailsDialog({ book, open, onOpenChange, onUpdateBook }: BookDetailsDialogProps) {
  const [currentBookData, setCurrentBookData] = useState<Book | null>(book);
  const [userNotes, setUserNotes] = useState<string>("");
  const [currentPageInput, setCurrentPageInput] = useState<string>("");
  const [enhancedSuggestions, setEnhancedSuggestions] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentBookData(book);
    if (book) {
      setUserNotes(book.notes);
      setCurrentPageInput(String(book.currentPage));
      setEnhancedSuggestions([]); // Reset suggestions when book changes
    }
  }, [book]);

  if (!currentBookData) return null;

  const progress = currentBookData.totalPages > 0 ? (currentBookData.currentPage / currentBookData.totalPages) * 100 : 0;

  const handleSaveChanges = () => {
    if (!currentBookData) return;
    const newPage = parseInt(currentPageInput, 10);
    if (isNaN(newPage) || newPage < 0 || newPage > currentBookData.totalPages) {
      toast({
        title: "Invalid Page Number",
        description: `Page number must be between 0 and ${currentBookData.totalPages}.`,
        variant: "destructive",
      });
      return;
    }
    const updatedBook = { ...currentBookData, notes: userNotes, currentPage: newPage };
    onUpdateBook(updatedBook);
    toast({
      title: "Book Updated",
      description: `${currentBookData.title} has been updated successfully.`,
    });
    // onOpenChange(false); // Optionally close dialog on save
  };

  const handleEnhanceNotes = async () => {
    if (!currentBookData || !userNotes) {
      toast({
        title: "Cannot Enhance Notes",
        description: "Please write some notes first.",
        variant: "destructive",
      });
      return;
    }
    setIsEnhancing(true);
    setEnhancedSuggestions([]);
    try {
      const result = await enhanceNotes({ notes: userNotes, bookTitle: currentBookData.title });
      setEnhancedSuggestions(result.suggestedQuestions);
      toast({
        title: "Notes Enhanced!",
        description: "AI has suggested some questions based on your notes.",
      });
    } catch (error) {
      console.error("Failed to enhance notes:", error);
      toast({
        title: "Error Enhancing Notes",
        description: "Could not get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col bg-card">
        <DialogHeader className="pr-6"> {/* pr-6 to avoid overlap with X button */}
          <div className="flex items-start space-x-4">
            <Image
              src={currentBookData.coverImageUrl || `https://placehold.co/100x150.png`}
              alt={`Cover of ${currentBookData.title}`}
              width={100}
              height={150}
              className="rounded object-cover border shadow-md"
              data-ai-hint="book artwork"
            />
            <div>
              <DialogTitle className="text-3xl font-bold">{currentBookData.title}</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">By {currentBookData.author}</DialogDescription>
              <DialogDescription className="text-sm text-muted-foreground">Total Pages: {currentBookData.totalPages}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto p-1 pr-3 -mr-1">
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="currentPage" className="text-base">Current Page</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="currentPage"
                  type="number"
                  value={currentPageInput}
                  onChange={(e) => setCurrentPageInput(e.target.value)}
                  max={currentBookData.totalPages}
                  min="0"
                  className="w-24"
                />
                <span className="text-muted-foreground">/ {currentBookData.totalPages}</span>
              </div>
              <Progress value={progress} className="w-full h-2.5 mt-2" />
            </div>

            <div>
              <Label htmlFor="notes" className="text-base">My Notes</Label>
              <Textarea
                id="notes"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Write your thoughts, reflections, or important quotes here..."
                rows={8}
                className="mt-1"
              />
            </div>

            {enhancedSuggestions.length > 0 && (
              <div className="p-4 border rounded-md bg-accent/20">
                <h3 className="text-md font-semibold mb-2 flex items-center text-primary">
                  <Lightbulb className="h-5 w-5 mr-2" /> AI Suggested Questions:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {enhancedSuggestions.map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
           <Button
            variant="outline"
            onClick={handleEnhanceNotes}
            disabled={isEnhancing || !userNotes}
            className="w-full sm:w-auto"
          >
            {isEnhancing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Enhance Notes
          </Button>
          <div className="flex-grow hidden sm:block"></div> {/* Spacer */}
          <DialogClose asChild>
             <Button variant="ghost" className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
