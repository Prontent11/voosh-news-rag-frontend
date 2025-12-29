import { useState, useEffect, useCallback } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendMessage, getChatHistory, resetSession } from '../api/chat';
import './ChatContainer.scss';

const SESSION_KEY = 'news-rag-session-id';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load session and history on mount
  useEffect(() => {
    const initSession = async () => {
      const storedSessionId = localStorage.getItem(SESSION_KEY);
      
      if (storedSessionId) {
        try {
          const history = await getChatHistory(storedSessionId);
          setMessages(history);
          setSessionId(storedSessionId);
        } catch (error) {
          console.error('Failed to load chat history:', error);
          localStorage.removeItem(SESSION_KEY);
        }
      }
      
      setIsInitializing(false);
    };

    initSession();
  }, []);

  const handleSend = useCallback(async (message) => {
    // Add user message immediately
    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(message, sessionId);
      
      // Save session ID if new
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
        localStorage.setItem(SESSION_KEY, response.sessionId);
      }

      // Add assistant message
      const assistantMessage = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleReset = useCallback(async () => {
    if (sessionId) {
      try {
        await resetSession(sessionId);
      } catch (error) {
        console.error('Failed to reset session:', error);
      }
    }
    
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem(SESSION_KEY);
  }, [sessionId]);

  if (isInitializing) {
    return (
      <div className="chat-container">
        <header className="chat-header">
          <div className="chat-header__title">
            <div className="chat-header__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <h1>News RAG Chatbot</h1>
          </div>
        </header>
        <div className="chat-container__loading">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header__title">
          <div className="chat-header__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <h1>News RAG Chatbot</h1>
        </div>
        <button 
          className="chat-header__reset"
          onClick={handleReset}
          disabled={messages.length === 0 && !sessionId}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset</span>
        </button>
      </header>
      
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

export default ChatContainer;
