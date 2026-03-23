'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SummaryCard() {
  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="p-1.5 rounded bg-gold/20">
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
        <h2 className="text-lg font-semibold text-white">Quick Insights</h2>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-sm text-gray-300 leading-relaxed space-y-6">
        <div>
          <p className="mb-4">
            This document outlines the Q3 Financial Report and Strategic Goals for Project Alpha. It details budget allocations, projected growth margins, and key market expansion areas.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-medium mb-3 text-base">Key Highlights</h3>
          <ul className="space-y-3">
            {[
              "Q3 Revenue exceeded targets by 14.5% due to enterprise segment growth.",
              "Budget allocation for R&D is increased to $4.2M for the upcoming quarter.",
              "Market expansion planned for APAC region by early 2025.",
              "Operational costs reduced by 6% leveraging new AI automation tools."
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
