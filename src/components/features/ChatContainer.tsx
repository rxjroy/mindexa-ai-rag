'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, CornerDownRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { api } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  source_refs?: string | null;
}

export default function ChatContainer() {
  const { activeWorkspace, activeConversationId, setActiveConversationId, activeDocumentId, documents, startNewChat } = useWorkspace();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeDoc = documents.find(d => d.id === activeDocumentId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isReceiving]);

  // Fetch history when activeConversationId changes
  useEffect(() => {
    async function loadHistory() {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }
      try {
        const history = await api.chat.getHistory(activeConversationId);
        setMessages(history.messages);
      } catch (e) {
        console.error('Failed to load history', e);
        setMessages([]);
      }
    }
    loadHistory();
  }, [activeConversationId]);

  const handleSend = async () => {
    if (!inputVal.trim() || isReceiving || !activeWorkspace) return;

    const userMsg: ChatMessage = { role: 'user', content: inputVal };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsReceiving(true);

    let convId = activeConversationId;
    
    try {
      if (!convId) {
        // Create conversation if none active
        const newConv = await api.chat.createConversation(activeWorkspace.id, inputVal.substring(0, 50));
        convId = newConv.id;
        setActiveConversationId(convId);
      }

      // Add empty assistant message to stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      // Standard fetch request for SSE
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/v1/conversations/${convId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: userMsg.content })
      });

      if (!response.ok) throw new Error('Failed to stream');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr) {
                try {
                  const payload = JSON.parse(dataStr);
                  if (payload.done) {
                    done = true;
                  } else if (payload.content) {
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const last = newMessages[newMessages.length - 1];
                      if (last && last.role === 'assistant') {
                        last.content += payload.content;
                      }
                      return newMessages;
                    });
                  }
                } catch (err) {
                  // ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        }
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        if (last && last.role === 'assistant') {
          last.content = "Connection lost or failed to process request.";
        }
        return newMessages;
      });
    } finally {
      setIsReceiving(false);
    }
  };

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card flex flex-col h-full overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.05] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10">
        <h2 className="text-base font-medium text-white/90 flex items-center gap-2">
          <Bot className="w-4 h-4 text-gold/80" />
          Ask Mindexa
        </h2>
        <div className="flex items-center gap-3">
          {activeDoc ? (
            <span className="text-xs text-gold/60 font-light hidden sm:inline-block max-w-[200px] truncate">Document: {activeDoc.name}</span>
          ) : (
            <span className="text-xs text-gray-500 font-light hidden sm:inline-block">General Chat</span>
          )}
          <button 
            onClick={startNewChat}
            disabled={!activeConversationId}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Start New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <motion.div 
        ref={scrollRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-gold/60" />
            </div>
            <p className="text-sm text-gray-400 font-light">
              Hi! I'm ready to answer any questions {activeDoc ? `about ${activeDoc.name}` : 'you might have'}.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div variants={messageVariants} key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
              msg.role === 'assistant' 
                ? 'bg-gold/10 text-gold' 
                : 'bg-white/[0.03] border border-white/5 text-gray-400'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed font-light ${
                msg.role === 'user'
                  ? 'bg-white/[0.03] border border-white/[0.05] text-gray-200 rounded-tr-sm'
                  : 'bg-transparent text-gray-300'
              }`}>
                {msg.content}
              </div>
              
              {/* Parse source metadata if it exists */}
              {msg.source_refs && (
                <div className="flex items-center gap-1.5 text-xs text-gold/60 px-2 mt-1">
                  <CornerDownRight className="w-3 h-3" />
                  from <span className="font-medium">Indexed Document</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Receiving Indicator */}
        {isReceiving && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
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
        )}
      </motion.div>
      
      <div className="p-4 border-t border-white/[0.05] bg-background/50 backdrop-blur-sm z-10">
        <form 
          className="relative flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isReceiving}
            placeholder="Ask a question..." 
            className="w-full bg-white/[0.02] border border-white/10 text-gray-200 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:bg-white/[0.04] transition-all placeholder:text-gray-600 font-light disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!inputVal.trim() || isReceiving}
            className="absolute right-2 p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
