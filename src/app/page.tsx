import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Search } from 'lucide-react';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Testimonials } from '@/components/ui/unique-testimonial';
import { FlipWords } from '@/components/ui/flip-words';
import LandingHeader from '@/components/layout/LandingHeader';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-gold/30 selection:text-white">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-40 pb-32 lg:pt-52 lg:pb-48 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Shader Background */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen opacity-70">
            <ShaderAnimation className="w-full h-full" />
          </div>
          {/* Background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none z-0" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium mb-8 badge-glow">
              <SparklesIcon className="w-3.5 h-3.5 sparkle-spin" />
              <span className="badge-shimmer-text">Mindexa AI 2.0 is now live</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mb-6 leading-tight">
              Unlock the intelligence hidden inside your{' '}
              <FlipWords
                words={['documents.', 'insights.', 'knowledge.', 'analytics.', 'patterns.']}
                duration={1000}
                className="text-gold"
              />
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
              Upload any PDF and let Mindexa AI generate instant summaries, extract key insights, and answer your questions with precise page citations.
            </p>

            <AnimatedButton href="/dashboard" label="TRY IT OUT" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-charcoal/50 border-y border-white/5 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Enterprise-Grade Document Intelligence</h2>
              <p className="text-gray-400 max-w-xl mx-auto">Everything you need to read faster, comprehend deeper, and make better decisions from your data.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mx-auto">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-gold" />,
                  title: "Instant Summarization",
                  desc: "Mindexa AI digests 100-page reports in seconds, rendering concise, actionable bullet points."
                },
                {
                  icon: <Search className="w-6 h-6 text-gold" />,
                  title: "Context-Aware Q&A",
                  desc: "Ask anything about your document. Our system understands the nuanced context to deliver exact answers."
                },
                {
                  icon: <Shield className="w-6 h-6 text-gold" />,
                  title: "Precise Citations",
                  desc: "Every answer includes a direct reference to the exact page and paragraph it was sourced from."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-surface/50 border border-white/10 p-8 rounded-3xl hover:bg-white/5 hover:border-gold/30 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-6 py-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Loved by Teams Worldwide</h2>
              <p className="text-gray-400 max-w-xl mx-auto">See how professionals are accelerating their workflows with Mindexa AI.</p>
            </div>
            <Testimonials />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-charcoal/80 backdrop-blur-lg pt-16 pb-8 px-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative z-10">
          <Link href="/" className="flex items-center group">
            <img src="/images/logo.png" alt="Mindexa AI" className="h-16 w-auto object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
          </Link>

          <nav className="flex gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-gold transition-colors duration-300 relative group">
              Features
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
        </div>
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
