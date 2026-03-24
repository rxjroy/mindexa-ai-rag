import React from 'react';
import Link from 'next/link';
import { Settings, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-24 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300">
      <Link href="/" className="group flex items-center">
        <img src="/images/logo.png" alt="Mindexa AI" className="h-16 w-auto object-contain transition-transform group-hover:scale-105 group-hover:brightness-125" />
      </Link>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark p-[2px] cursor-pointer">
          <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gold" />
          </div>
        </div>
      </div>
    </nav>
  );
}
