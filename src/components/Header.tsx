import { BookMarked } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center">
        <BookMarked className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-primary">LexiTrack</h1>
      </div>
    </header>
  );
}
