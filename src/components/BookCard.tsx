"use client";

import type { Book } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { BookOpenText, Edit3, Trash2, Sparkles, AlignLeft } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface BookCardProps {
  book: Book;
  onOpenDetails: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export function BookCard({ book, onOpenDetails, onDelete }: BookCardProps) {
  const progress = book.totalPages > 0 ? (book.currentPage / book.totalPages) * 100 : 0;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-card">
      <CardHeader className="p-4">
        <div className="flex items-start space-x-4">
          <Image
            src={book.coverImageUrl || `https://placehold.co/100x150.png`}
            alt={`Cover of ${book.title}`}
            width={80}
            height={120}
            className="rounded object-cover border"
            data-ai-hint="book cover"
          />
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold leading-tight mb-1">{book.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">By {book.author}</CardDescription>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Added {formatDistanceToNow(new Date(book.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            Page {book.currentPage} of {book.totalPages}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t">
        <div className="flex w-full justify-between items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onOpenDetails(book)} className="flex-1">
            <BookOpenText className="mr-2 h-4 w-4" /> Details
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(book.id)} aria-label="Delete book">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
