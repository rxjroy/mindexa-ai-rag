'use client';
import React, { useState } from 'react';
import { Send, Bot, User, CornerDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6,
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ChatContainer() {
  const [messages] = useState([
    {
      role: 'assistant',
      content: 'I have analyzed the Q3 Financial Report. What specific information would you like to know?',
      pageRef: null
    },
    {
      role: 'user',
      content: 'What were the main drivers for the revenue growth?',
      pageRef: null
    },
    {
      role: 'assistant',
      content: 'The main drivers for the 14.5% revenue growth were the accelerated adoption in the enterprise segment, particularly our new cloud services, and a successful upsell campaign targeting existing mid-market clients.',
      pageRef: 'Page 12'
    }
  ]);

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card flex flex-col h-full overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.05] flex items-center justify-between">
        <h2 className="text-base font-medium text-white/90 flex items-center gap-2">
          <Bot className="w-4 h-4 text-gold/80" />
          Ask Mindexa
        </h2>
        <span className="text-xs text-gold/60 font-light">Document: Q3_Financial_Report.pdf</span>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <motion.div variants={messageVariants} key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' 
                ? 'bg-gold/10 text-gold' 
                : 'bg-white/[0.03] border border-white/5 text-gray-400'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed font-light ${
                msg.role === 'user'
                  ? 'bg-white/[0.03] border border-white/[0.05] text-gray-200 rounded-tr-sm'
                  : 'bg-transparent text-gray-300'
              }`}>
                {msg.content}
              </div>
              
              {msg.pageRef && (
                <div className="flex items-center gap-1.5 text-xs text-gold/60 px-2 cursor-pointer hover:text-gold/80 transition-colors">
                  <CornerDownRight className="w-3 h-3" />
                  from <span className="font-medium">{msg.pageRef}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Mock Typing Indicator */}
        <motion.div variants={messageVariants} className="flex gap-4 opacity-70">
           <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gold/10 text-gold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </motion.div>
      </motion.div>
      
      <div className="p-4 border-t border-white/[0.05]">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask a question..." 
            className="w-full bg-white/[0.02] border border-white/10 text-gray-200 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:bg-white/[0.04] transition-all placeholder:text-gray-600 font-light"
          />
          <button className="absolute right-2 p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
