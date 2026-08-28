const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getBusiness: () => request('/business'),
  saveBusiness: (payload) => request('/business', { method: 'PUT', body: JSON.stringify(payload) }),
  getAssistants: () => request('/assistants'),
  getOllamaHealth: () => request('/health/ollama'),
  getActivity: () => request('/activity'),
  sendMessage: (payload) => request('/chat', { method: 'POST', body: JSON.stringify(payload) }),
  getLatestConversation: (assistantKey) => request(`/conversations/assistant/${assistantKey}/latest`),
  deleteConversation: (id) => request(`/conversations/${id}`, { method: 'DELETE' }),

  // Milestone 2 — Business Intelligence
  uploadBusinessData: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/business-data/upload`, { method: 'POST', body: formData });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status})`);
    return data;
  },
  getBusinessDataSummary: () => request('/business-data/summary'),
  generateWeeklyReport: () => request('/reports/weekly', { method: 'POST' }),
  getReports: () => request('/reports'),
  generateSuggestions: () => request('/suggestions', { method: 'POST' }),
  getSettings: () => request('/settings'),
  updateSettings: (payload) => request('/settings', { method: 'PUT', body: JSON.stringify(payload) }),
};
