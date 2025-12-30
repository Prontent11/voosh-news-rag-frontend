# 📰 News RAG Chatbot — Frontend

Frontend for the News RAG Chatbot.  
Provides a simple chat interface to interact with a Retrieval-Augmented Generation (RAG) backend.

---

## Overview

- Built using **React + Vite**
- UI scaffolded using **Lovable**
- Integrates with REST-based backend API
- Supports session-based chat
- Bot responses are rendered using a **typed-out (progressive) effect**

---

## Lovable Usage

The initial UI and component structure were generated using **Lovable**.

### Prompt Used:

```
Create a single-page chat interface for a news chatbot that:
- Has a clean, modern design with a message input at the bottom
- Integrates with a REST backend API (POST /api/chat endpoint)
- Persists sessionId in localStorage for conversation continuity
- Displays user messages on the right and assistant messages on the left
- Includes a reset chat button to start a new conversation
- Shows a typing indicator while waiting for responses
- Auto-scrolls to the latest message
```

The generated code was later refined and connected to the actual backend.

---

## Typed-Out Responses

The frontend simulates streaming by progressively rendering the full response returned by the backend.

- Backend returns the complete response
- Frontend displays it character-by-character
- Improves UX without backend streaming complexity

---

## Environment Variable

Create a `.env` file:

```env
VITE_BACKEND_API=https://your-backend-url.onrender.com
```

Used in code as:
```javascript
const BASE_URL = import.meta.env.VITE_BACKEND_API;
```

---

## Run Locally

```bash
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## Backend Dependency

The frontend expects the backend to expose:

- `POST /api/chat`
- `GET /api/history/:sessionId`
- `DELETE /api/reset/:sessionId`

---

## Related Repository

Backend Repository : https://github.com/Prontent11/voosh-news-rag-backend/tree/main

---

## Status

✔ Frontend complete  
✔ Integrated with backend  
✔ Ready for deployment
