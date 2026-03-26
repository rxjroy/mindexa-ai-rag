'use client';
import React from 'react';
import { Sparkles, FileText, Clock, HardDrive, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function SummaryCard() {
  const { documents, activeDocumentId } = useWorkspace();
  
  const activeDoc = documents.find(d => d.id === activeDocumentId);
  
  if (!activeDoc) {
    return (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card flex flex-col h-full overflow-hidden items-center justify-center p-6 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-gray-500" />
        </div>
        <h2 className="text-gray-300 font-medium mb-1">No Document Selected</h2>
        <p className="text-sm font-light text-gray-500">Select a document from the sidebar to view details</p>
      </motion.div>
    );
  }

  const formatSize = (bytes?: number) => bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
  const isReady = activeDoc.status === 'ready';
  const isFailed = activeDoc.status === 'failed';
  const isProcessing = activeDoc.status === 'processing' || activeDoc.status === 'pending';

  return (
    <motion.div 
      key={activeDoc.id}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card flex flex-col h-full overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.05] flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-gold/80" />
        <h2 className="text-base font-medium text-white/90">Document Info</h2>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        
        <div>
          <h3 className="text-white font-medium text-lg leading-tight mb-2">{activeDoc.name}</h3>
          
          <div className="flex items-center gap-2 mb-6">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5 ${
              isReady ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
              isFailed ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
              'bg-gold/10 text-gold border border-gold/20'
            }`}>
              {isReady && <CheckCircle2 className="w-3 h-3" />}
              {isFailed && <AlertCircle className="w-3 h-3" />}
              {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
              {activeDoc.status}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-light text-gray-400">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <span>Size: {formatSize(activeDoc.file_size_bytes)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-light text-gray-400">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>Uploaded: {new Date(activeDoc.created_at).toLocaleString()}</span>
          </div>
        </div>

        {isReady && (
          <div className="mt-8 p-4 rounded-xl bg-gold/5 border border-gold/10">
            <p className="text-sm text-gold/80 font-light leading-relaxed">
              This document has been fully processed and embedded into the vector store. You can now use the Chat interface to ask questions about its contents.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
