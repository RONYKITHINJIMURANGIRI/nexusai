import { useState, useEffect, useRef } from 'react';

// Default initial message if none provided and nothing in localStorage
const DEFAULT_INITIAL_MESSAGE = {
  id: '1',
  role: 'assistant',
  text: 'Welcome to NexusAI. Start your conversation by typing a message.',
};

function useChat(customInitialMessages) {
  // Determine initial messages: from localStorage, then custom prop, then default
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('nexusai-chat-messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse chat messages from localStorage', e);
      }
    }
    // If customInitialMessages is provided, use it; otherwise use default
    if (customInitialMessages && Array.isArray(customInitialMessages)) {
      return customInitialMessages;
    }
    return [DEFAULT_INITIAL_MESSAGE];
  });

  // Store the initial messages for reset functionality
  const initialMessagesRef = useRef([]);
  useEffect(() => {
    initialMessagesRef.current = [...messages];
  }, [messages]);

  const [prompt, setPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  // Ref to track the message container for scrolling (will be set by component)
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('nexusai-chat-messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat messages to localStorage', e);
    }
  }, [messages]);

  // Function to set the ref for the message container (to be used by component)
  const setMessagesEndRef = (node) => {
    if (node) {
      messagesEndRef.current = node;
      // Scroll to bottom when ref is set and there are messages
      if (messages.length > 0) {
        node.scrollTop = node.scrollHeight;
      }
    }
  };

  // Scroll to bottom when messages change (if we have a ref)
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    if (isSending) return; // Prevent sending while already sending

    const userMessage = { id: `${Date.now()}-user`, role: 'user', text: prompt.trim() };
    setMessages((current) => [...current, userMessage]);
    setPrompt('');
    setIsSending(true);
    setError(null);

    try {
      // Simulate API call with random success/failure for demonstration
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random error 10% of the time
          if (Math.random() < 0.1) {
            reject(new Error('Failed to get response from AI'));
          } else {
            resolve();
          }
        }, 800);
      });

      // Simulate AI response
      const aiResponse = `This is a sophisticated response to: "${userMessage.text}". ` +
        `The NexusAI system has processed your message and generated this reply.`;
      setMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant`, role: 'assistant', text: aiResponse },
      ]);
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
      // Remove the user message we just added since the send failed
      setMessages((current) => current.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    // Reset to the initial messages (from localStorage, custom prop, or default)
    setMessages([...initialMessagesRef.current]);
    setPrompt('');
    setError(null);
    setIsSending(false);
  };

  return {
    messages,
    prompt,
    setPrompt,
    isSending,
    error,
    sendMessage,
    clearChat,
    // Ref setter for the message container to enable auto-scroll
    setMessagesEndRef,
  };
}

export default useChat;