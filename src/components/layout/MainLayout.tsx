import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex-1 bg-charcoal overflow-y-auto rounded-tl-2xl shadow-[-10px_-10px_30px_0_rgba(0,0,0,0.5)]">
      {children}
    </main>
  );
}
