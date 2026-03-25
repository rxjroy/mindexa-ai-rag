"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Testimonials } from '@/components/ui/unique-testimonial';
import { FlipWords } from '@/components/ui/flip-words';
import LandingHeader from '@/components/layout/LandingHeader';
import HorizontalScrollFeatures from '@/components/features/HorizontalScrollFeatures';
import HowItWorks from '@/components/features/HowItWorks';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-gold/30 selection:text-white">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-40 pb-32 lg:pt-52 lg:pb-48 flex flex-col items-center justify-center text-center overflow-hidden min-h-[90vh]">
          {/* Shader Background */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen opacity-70">
            <ShaderAnimation className="w-full h-full" />
          </div>
          {/* Background glows */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none z-0" 
          />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium mb-8 badge-glow"
            >
              <SparklesIcon className="w-3.5 h-3.5 sparkle-spin" />
              <span className="badge-shimmer-text">Mindexa AI 2.0 is now live</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mb-6 leading-tight"
            >
              Unlock the <span className="font-playfair italic text-gold font-normal px-1">intelligence</span> hidden inside your{' '}
              <FlipWords
                words={['documents.', 'insights.', 'knowledge.', 'analytics.', 'patterns.']}
                duration={1000}
                className="text-gold"
              />
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed"
            >
              Upload any PDF and let Mindexa AI generate instant summaries, extract key insights, and answer your questions with precise page citations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <AnimatedButton href="/dashboard" label="TRY IT OUT" />
            </motion.div>
          </div>
        </section>

        {/* Features Section - Horizontal Scroll */}
        <HorizontalScrollFeatures />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <section id="testimonials" className="px-6 py-32 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)', y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
            viewport={{ margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-20 px-6">
              <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mx-auto mb-6 leading-tight">Loved by Teams Worldwide</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">See how professionals are accelerating their workflows with Mindexa AI.</p>
            </div>
            <Testimonials />
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-charcoal/80 backdrop-blur-lg pt-16 pb-8 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ margin: "-10%" }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" 
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative z-10"
        >
          <Link 
            href="/" 
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center group"
          >
            <img src="/images/logo.png" alt="Mindexa AI" className="h-16 w-auto object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
          </Link>

          <nav className="flex gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="#testimonials" className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 relative group">
              Testimonials
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm tracking-wide text-gray-500">
              © {new Date().getFullYear()} Mindexa AI.
            </p>

            <a
              href="https://github.com/rxjroy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0)] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-500"
            >
              <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#D4AF37] animate-pulse" />
              <span className="text-sm text-gray-400 group-hover:text-gold transition-colors duration-300 font-medium tracking-wide">
                made by raj roy
              </span>
              <span className="text-sm text-gray-600 group-hover:text-gold/70 transition-colors duration-300">
                (rxjroy)
              </span>
            </a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}
