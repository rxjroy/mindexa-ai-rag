"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <header
        className={`
          pointer-events-auto
          flex items-center justify-between
          transition-all duration-500 ease-in-out
          border border-white/10
          backdrop-blur-xl
          ${scrolled
            ? "w-full max-w-3xl px-5 py-2.5 rounded-full bg-background/85 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-white/15"
            : "w-full max-w-5xl px-6 py-3.5 rounded-2xl bg-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          }
        `}
      >
        {/* Logo — height-only so portrait image shows at correct ratio */}
        <Link href="/" className="group flex items-center">
          <img
            src="/images/logo.png"
            alt="Mindexa AI"
            className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 group-hover:brightness-125 ${
              scrolled ? "h-12" : "h-16"
            }`}
          />
        </Link>

        {/* Nav links + Login */}
        <div className="flex items-center gap-5">
          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Testimonials", href: "#testimonials" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="relative text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
              >
                {label}
                {/* underline hover effect */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Login — same animated button, smaller scale */}
          <div className={`transition-all duration-500 ${scrolled ? "scale-90" : "scale-100"}`}>
            <AnimatedButton href="/dashboard" label="LOGIN" />
          </div>
        </div>
      </header>
    </div>
  );
}
