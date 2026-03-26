const API_BASE = 'http://localhost:8000/api/v1';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  } else {
    // Let the browser set the boundary for FormData
    headers.delete('Content-Type'); 
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.detail || 'API request failed', response.status);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      return fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    signup: async (email: string, fullName: string, password: string) => {
      return fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, full_name: fullName, password }),
      });
    },
    getMe: async () => {
      return fetchWithAuth('/auth/me');
    },
  },
  workspaces: {
    list: async () => {
      return fetchWithAuth('/workspaces');
    },
    create: async (name: string, description: string = '') => {
      return fetchWithAuth('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
      });
    },
  },
  documents: {
    list: async (workspaceId: string) => {
      return fetchWithAuth(`/workspaces/${workspaceId}/documents`);
    },
    upload: async (workspaceId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetchWithAuth(`/workspaces/${workspaceId}/documents`, {
        method: 'POST',
        body: formData,
      });
    },
    delete: async (documentId: string) => {
      return fetchWithAuth(`/documents/${documentId}`, {
        method: 'DELETE',
      });
    },
  },
  chat: {
    listConversations: async (workspaceId: string) => {
      return fetchWithAuth(`/workspaces/${workspaceId}/conversations`);
    },
    createConversation: async (workspaceId: string, title: string = 'New Chat') => {
      return fetchWithAuth(`/workspaces/${workspaceId}/conversations`, {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
    },
    getHistory: async (conversationId: string) => {
      return fetchWithAuth(`/conversations/${conversationId}`);
    },
    deleteConversation: async (conversationId: string) => {
      return fetchWithAuth(`/conversations/${conversationId}`, {
        method: 'DELETE',
      });
    },
  },
};
