'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="h-24 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300"
    >
      <Link href="/" className="group flex items-center">
        <img src="/images/logo.png" alt="Mindexa AI" className="h-16 w-auto object-contain transition-transform group-hover:scale-105 group-hover:brightness-125" />
      </Link>
      
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={handleLogout}
          title="Sign Out"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-gold"
        >
          <LogOut className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </motion.nav>
  );
}
