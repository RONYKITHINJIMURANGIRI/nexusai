import { useMemo } from 'react';
import useChat from '../hooks/useChat';
import Spinner from '../components/Spinner';

function ChatPage() {
  const { messages, prompt, setPrompt, isSending, sendMessage } = useChat();

  const conversation = useMemo(
    () => messages.map((message) => (
      <div key={message.id} className={`message ${message.role}`}>
        <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong>
        <p>{message.text}</p>
      </div>
    )),
    [messages]
  );

  return (
    <section className="panel">
      <h1 className="page-title">Chat</h1>
      <p className="subtitle">Send messages to your AI assistant and explore the conversation in real time.</p>
      <div className="chat-panel">{conversation}</div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask NexusAI something..."
          aria-label="Type your message"
        />
        <button type="submit" disabled={isSending}>
          {isSending ? <Spinner /> : 'Send'}
        </button>
      </form>
    </section>
  );
}

export default ChatPage;
