'use client';
import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { api } from '@/lib/api';

export default function UploadArea() {
  const { activeWorkspace } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    if (!activeWorkspace) return;
    
    setFile(selectedFile);
    setUploading(true);
    
    try {
      await api.documents.upload(activeWorkspace.id, selectedFile);
      // Wait a moment for UX before clearing or showing success
      setTimeout(() => {
        setUploading(false);
        setFile(null); // Clear to allow new uploads
      }, 1500);
    } catch (e) {
      console.error('Failed to upload', e);
      setUploading(false);
      // Ideally show an error toast here
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-light mb-4 text-white/90 flex items-center gap-3">
        <UploadCloud className="w-5 h-5 text-gold/80" />
        Document Upload
      </h2>
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border border-dashed transition-all duration-500 p-8 flex flex-col items-center justify-center min-h-[160px] cursor-pointer
          ${isDragging ? 'border-gold/50 bg-gold/5' : 'border-white/10 hover:border-white/30 bg-white/[0.01] hover:bg-white/[0.03]'}
          `}
      >
        <AnimatePresence mode="wait">
          {!file && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Upload a document to get started</h3>
              <p className="text-sm text-gray-400 mb-6 font-light">Drag & drop your PDF here, or click to browse</p>
              <label className="cursor-pointer bg-white/[0.05] border border-white/10 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all">
                Browse Files
                <input type="file" className="hidden" accept=".pdf" onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])} />
              </label>
            </motion.div>
          )}

          {file && (
            <motion.div 
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center w-full justify-between bg-white/5 p-4 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <File className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    {uploading ? (
                      <span className="text-xs text-gold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full border-2 border-gold border-t-transparent animate-spin"></span>
                        Uploading...
                      </span>
                    ) : (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
