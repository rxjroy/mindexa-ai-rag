import React from 'react';
import Link from 'next/link';
import { Command, Zap, Shield, Search, ChevronRight, Star } from 'lucide-react';
import { ShaderAnimation } from '@/components/ui/shader-animation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans selection:bg-gold/30 selection:text-white">
      {/* Header */}
      <header className="h-20 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8 lg:px-16 transition-all duration-300">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-28 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Mindexa AI" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Features</Link>
          <Link href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Testimonials</Link>
          <Link href="/dashboard" className="text-sm bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition-colors border border-white/5 font-medium">
            Login
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-32 lg:py-48 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Shader Background */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen opacity-70">
            <ShaderAnimation className="w-full h-full" />
          </div>
          {/* Background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium mb-8">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Mindexa AI 2.0 is now live</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mb-6 leading-tight">
              Unlock the intelligence hidden inside your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">documents.</span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
              Upload any PDF and let Mindexa AI generate instant summaries, extract key insights, and answer your questions with precise page citations.
            </p>
            
            <Link href="/dashboard" className="group relative inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-background px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] hover:-translate-y-1">
              Try it out now
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-charcoal/50 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Enterprise-Grade Document Intelligence</h2>
              <p className="text-gray-400 max-w-xl mx-auto">Everything you need to read faster, comprehend deeper, and make better decisions from your data.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Loved by Teams Worldwide</h2>
              <p className="text-gray-400 max-w-xl mx-auto">See how professionals are accelerating their workflows with Mindexa AI.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { quote: "Mindexa AI completely transformed our legal review process. We digest contracts 10x faster now while catching edge cases we used to miss.", author: "Sarah Jenkins", role: "Legal Director at FinCorp" },
                { quote: "The precise source referencing is a game changer. I no longer have to double-check the AI's hallucinations—it points me exactly to the page.", author: "Michael Chen", role: "Financial Analyst" },
                { quote: "It feels like having an insanely smart intern who just read through thousands of pages of research and is ready to answer any question.", author: "Elena Rodriguez", role: "Research Head" }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative">
                  <div className="flex text-gold mb-6 gap-1">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-300 mb-8 italic">"{testimonial.quote}"</p>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-charcoal py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Mindexa AI" className="w-24 h-8 object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all" />
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Mindexa AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
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
