'use client';
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_DOCS = [
  { id: 1, title: 'Q3_Financial_Report.pdf', date: '2 hours ago', size: '2.4 MB', active: true },
  { id: 2, title: 'Project_Alpha_Specs.pdf', date: 'Yesterday', size: '1.1 MB', active: false },
  { id: 3, title: 'Employee_Handbook_2024.pdf', date: 'Oct 12', size: '5.6 MB', active: false },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-80 h-full bg-background flex flex-col border-r border-white/5"
    >
      <div className="p-6">
        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-xl border border-white/10 hover:border-gold/50 transition-all duration-300 group">
          <Plus className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      <div className="px-6 pb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Documents</h3>
      </div>
      
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar"
      >
        {MOCK_DOCS.map((doc) => (
          <motion.div 
            variants={itemVariants}
            key={doc.id}
            className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              doc.active 
                ? 'bg-gold/10 border-gold/30' 
                : 'bg-transparent border-transparent hover:bg-white/5'
            } border`}
          >
            <div className={`p-2 rounded-lg ${doc.active ? 'bg-gold/20' : 'bg-surface'}`}>
              <FileText className={`w-5 h-5 ${doc.active ? 'text-gold' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium truncate ${doc.active ? 'text-white' : 'text-gray-300'}`}>
                {doc.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{doc.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="text-xs text-gray-500">{doc.size}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Bottom decorative fading effect for scroll area */}
      <div className="h-6 bg-gradient-to-t from-background to-transparent mt-auto sticky bottom-0"></div>
    </motion.aside>
  );
}
