import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Mindexa AI | Document Intelligence',
  description: 'AI-powered document intelligence system (RAG)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${playfair.variable}`}>
      <body className="font-sans bg-background text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
