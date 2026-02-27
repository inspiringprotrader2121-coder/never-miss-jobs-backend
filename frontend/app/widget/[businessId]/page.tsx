'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Config {
  businessName: string;
  welcomeMessage: string;
}

export default function ChatWidget() {
  const params = useParams();
  const businessId = params['businessId'] as string;

  const [config, setConfig] = useState<Config | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get<Config>(`${API_URL}/ai/public/config/${businessId}`)
      .then((res) => {
        setConfig(res.data);
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: res.data.welcomeMessage
          }
        ]);
      })
      .catch(() => {
        setConfig({ businessName: 'Us', welcomeMessage: 'Hi! How can I help you today?' });
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi! How can I help you today?'
          }
        ]);
      });
  }, [businessId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post<{ reply: string; conversationId: string }>(
        `${API_URL}/ai/public/chat/${businessId}`,
        { message: text, conversationId }
      );
      setConversationId(res.data.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.data.reply
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now. Please try again shortly."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-blue-600 px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
          {config?.businessName?.[0] ?? '?'}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">
            {config?.businessName ?? 'Loading…'}
          </p>
          <p className="text-xs opacity-80">AI Assistant · Typically replies instantly</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border bg-gray-50 px-4 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            type="text"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
            aria-label="Send"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-gray-400">
          Powered by TradeBooking
        </p>
      </div>
    </div>
  );
}
