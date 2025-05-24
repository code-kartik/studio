"use client";

import type { Book } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  totalPages: z.coerce.number().int().positive("Total pages must be a positive number"),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  onSubmit: (data: BookFormValues) => void;
  initialData?: Partial<Book>;
  isLoading?: boolean;
}

export function BookForm({ onSubmit, initialData, isLoading = false }: BookFormProps) {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      totalPages: initialData?.totalPages || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The Great Gatsby" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="F. Scott Fitzgerald" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalPages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Pages</FormLabel>
              <FormControl>
                <Input type="number" placeholder="180" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? "Saving..." : initialData?.id ? "Save Changes" : "Add Book"}
        </Button>
      </form>
    </Form>
  );
}
