import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
