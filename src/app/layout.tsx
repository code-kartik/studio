import type {Metadata} from 'next';
import { Lora } from 'next/font/google';
// Removed Geist_Sans and Geist_Mono imports from next/font/google
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

// Removed geistSans constant declaration
// Removed geistMono constant declaration

export const metadata: Metadata = {
  title: 'LexiTrack - Track Your Reading',
  description: 'Manage your books, track reading progress, and take notes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed geistSans.variable and geistMono.variable from className */}
      <body className={`${lora.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
