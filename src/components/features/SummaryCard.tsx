'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SummaryCard() {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card flex flex-col h-full overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.05] flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-gold/80" />
        <h2 className="text-base font-medium text-white/90">Quick Insights</h2>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-sm text-gray-400 leading-relaxed font-light space-y-6">
        <div>
          <p className="mb-4">
            This document outlines the Q3 Financial Report and Strategic Goals for Project Alpha. It details budget allocations, projected growth margins, and key market expansion areas.
          </p>
        </div>
        
        <div>
          <h3 className="text-white/80 font-medium mb-4 text-sm tracking-wide uppercase">Key Highlights</h3>
          <motion.ul 
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {[
              "Q3 Revenue exceeded targets by 14.5% due to enterprise segment growth.",
              "Budget allocation for R&D is increased to $4.2M for the upcoming quarter.",
              "Market expansion planned for APAC region by early 2025.",
              "Operational costs reduced by 6% leveraging new AI automation tools."
            ].map((item, i) => (
              <motion.li variants={itemVariants} key={i} className="flex gap-4 items-start">
                <div className="mt-2 w-1 h-1 rounded-full bg-gold/60 flex-shrink-0" />
                <span className="text-gray-300 font-light leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.div>
  );
}
