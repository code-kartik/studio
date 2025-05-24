export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  notes: string;
  coverImageUrl?: string; // Using placeholder for now
  createdAt: string; // ISO date string
}
