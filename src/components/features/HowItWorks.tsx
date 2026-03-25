"use client";

import React from 'react';
import { motion } from 'framer-motion';
import StickyTabs from '@/components/ui/sticky-section-tabs';
import { UploadCloud, Cpu, MessageSquare, CheckCircle } from 'lucide-react';

const StepContent: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <motion.div 
    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    viewport={{ margin: "-10% 0px -10% 0px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="flex flex-col items-center justify-center text-center py-24 px-6 min-h-[50vh]"
  >
    <div className="p-6 bg-gold/10 rounded-full mb-8 text-gold border border-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
      {icon}
    </div>
    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
      {title}
    </h3>
    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative bg-black w-full border-b border-white/5">
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)', y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
        viewport={{ margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pt-32 pb-16 text-center px-6 relative z-10"
      >
        <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto mb-6 leading-tight">
          How It Works
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          From raw documents to actionable intelligence in four simple steps.
        </p>
      </motion.div>

      <StickyTabs
        mainNavHeight="5rem"
        rootClassName="bg-black text-white"
        navSpacerClassName="border-b border-white/10 bg-black/80 backdrop-blur-md"
        sectionClassName="bg-[#0a0a0a]"
        stickyHeaderContainerClassName="shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        headerContentWrapperClassName="border-b border-t border-white/5 bg-black/95 backdrop-blur-xl"
        headerContentLayoutClassName="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8"
        titleClassName="my-0 text-xl font-medium tracking-wide leading-none md:text-2xl text-gold"
        contentLayoutClassName="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <StickyTabs.Item title="Step 1: Upload Documents" id="step-1">
          <StepContent 
            title="Upload Your PDFs" 
            description="Securely upload your contracts, research papers, or financial reports. Our system instantly ingests the document while preserving its original formatting, tables, and charts."
            icon={<UploadCloud className="w-16 h-16" />} 
          />
        </StickyTabs.Item>
        <StickyTabs.Item title="Step 2: AI Processing" id="step-2">
          <StepContent 
            title="Intelligent Vectorization" 
            description="Mindexa AI automatically parses and vectorizes your data. It generates an optimized semantic index that understands the nuanced context of every paragraph."
            icon={<Cpu className="w-16 h-16" />} 
          />
        </StickyTabs.Item>
        <StickyTabs.Item title="Step 3: Ask Questions" id="step-3">
          <StepContent 
            title="Natural Language Querying" 
            description="Chat directly with your documents. Ask complex, multi-part questions just like you would to a human expert, and get instantaneous, context-aware answers."
            icon={<MessageSquare className="w-16 h-16" />} 
          />
        </StickyTabs.Item>
        <StickyTabs.Item title="Step 4: Get Citations" id="step-4">
          <StepContent 
            title="Verifiable Intelligence" 
            description="Never second-guess an answer. Every insight provided by Mindexa AI comes with a precise citation pointing directly to the exact page and paragraph."
            icon={<CheckCircle className="w-16 h-16" />} 
          />
        </StickyTabs.Item>
      </StickyTabs>
    </section>
  );
};

export default HowItWorks;
