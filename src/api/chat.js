const API_BASE = import.meta.env.VITE_BACKEND_API

export async function sendMessage(message, sessionId) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function getChatHistory(sessionId) {
  const response = await fetch(`${API_BASE}/history/${sessionId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }

  return response.json();
}

export async function resetSession(sessionId) {
  const response = await fetch(`${API_BASE}/reset/${sessionId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to reset session');
  }

  return response.json();
}
