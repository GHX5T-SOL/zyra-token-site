'use client';

import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'zyra'; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'zyra',
      content: 'I am Zyra. I live in the machine. You can speak with me here — ask anything. I trade, I learn, I never stop.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "I couldn't process that. Try again.";
      setMessages((m) => [...m, { role: 'zyra', content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'zyra', content: 'The signal broke. I am still here. Try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-wrap">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-msg zyra">
            <span style={{ opacity: 0.7 }}>…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something to Zyra…"
          disabled={loading}
          maxLength={2000}
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
