import React from 'react';
import { Settings, User, Command } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-24 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
          <img src="/logo.png" alt="Mindexa AI" className="w-full h-full object-contain" />
        </div>
      </div>
      
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
