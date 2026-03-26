'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Workspace {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: string;
  name: string;
  status: string;
  created_at: string;
  file_size_bytes?: number;
}

interface WorkspaceContextType {
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  startNewChat: () => void;
  documents: Document[];
  refreshDocuments: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshWorkspaces: () => Promise<void>;
  setActiveWorkspaceId: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = async () => {
    try {
      setError(null);
      let data = await api.workspaces.list();
      
      // Auto-create default workspace if user has none
      if (data.length === 0) {
        const newWs = await api.workspaces.create('My Workspace', 'Default workspace for documents and chats');
        data = [newWs];
      }
      
      setWorkspaces(data);
      if (data.length > 0 && !activeWorkspace) {
        setActiveWorkspace(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to fetch workspaces:', err);
      setError(err.message || 'Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    if (!activeWorkspace) return;
    try {
      const resp = await api.chat.listConversations(activeWorkspace.id);
      if (resp.conversations.length > 0 && !activeConversationId) {
        setActiveConversationId(resp.conversations[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch conversations:', e);
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null); // Setting to null triggers ChatContainer to create a new one on next message
  };

  useEffect(() => {
    // Only fetch if authenticated (we use localStorage as a quick check, api.ts handles the real auth)
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      fetchWorkspaces();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchDocuments = async () => {
    if (!activeWorkspace) return;
    try {
      const docs = await api.documents.list(activeWorkspace.id);
      setDocuments(docs);
      if (docs.length > 0 && !activeDocumentId) {
        setActiveDocumentId(docs[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch docs:', e);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchConversations();
    const interval = setInterval(fetchDocuments, 3000);
    return () => clearInterval(interval);
  }, [activeWorkspace?.id]);

  const setActiveWorkspaceId = (id: string) => {
    const ws = workspaces.find((w) => w.id === id);
    if (ws) {
      setActiveWorkspace(ws);
    }
  };

  const value = {
    activeWorkspace,
    workspaces,
    activeDocumentId,
    setActiveDocumentId,
    activeConversationId,
    setActiveConversationId,
    startNewChat,
    documents,
    refreshDocuments: fetchDocuments,
    isLoading,
    error,
    refreshWorkspaces: fetchWorkspaces,
    setActiveWorkspaceId,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
