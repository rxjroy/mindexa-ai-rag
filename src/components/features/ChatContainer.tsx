'use client';
import React, { useState } from 'react';
import { Send, Bot, User, CornerDownRight } from 'lucide-react';

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
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-gold" />
          Ask Mindexa
        </h2>
        <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded border border-gold/20">Active Document: Q3_Financial_Report.pdf</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' 
                ? 'bg-gradient-to-br from-gold to-gold-dark text-background' 
                : 'bg-surface border border-white/10 text-gray-300'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-surface border border-white/5 text-gray-100 rounded-tr-sm'
                  : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              
              {msg.pageRef && (
                <div className="flex items-center gap-1.5 text-xs text-gold/80 bg-gold/5 px-2.5 py-1 rounded cursor-pointer hover:bg-gold/10 transition-colors border border-gold/10">
                  <CornerDownRight className="w-3 h-3" />
                  Answer from <span className="font-semibold underline decoration-gold/30 underline-offset-2">{msg.pageRef}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Mock Typing Indicator */}
        <div className="flex gap-4 opacity-50">
           <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-gold to-gold-dark text-background">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10 bg-background/50">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask a question about this document..." 
            className="w-full bg-surface border border-white/10 text-gray-100 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all shadow-inner placeholder:text-gray-500 font-light"
          />
          <button className="absolute right-2 p-2 rounded-lg bg-gold hover:bg-gold-light text-background transition-colors disabled:opacity-50">
            <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
