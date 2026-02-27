'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Send, Bot, User } from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResult {
  conversationId: string;
  reply: string;
  lead: { id: string; fullName: string | null; email: string | null; phone: string | null; status: string } | null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [lead, setLead] = useState<ChatResult['lead']>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post<ChatResult>('/ai/chat', {
        message: userMsg,
        conversationId
      });

      setConversationId(data.conversationId);
      if (data.lead) setLead(data.lead);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      toast.error('Failed to get AI response');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  function resetChat() {
    setMessages([]);
    setConversationId(undefined);
    setLead(null);
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="AI Chat" />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2">
                <Bot className="h-12 w-12 opacity-20" />
                <p className="text-sm">Start a conversation to test your AI assistant.</p>
                <p className="text-xs">This simulates the dashboard chat (authenticated).</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 max-w-2xl',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div className={cn(
                  'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                  msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-200'
                )}>
                  {msg.role === 'user'
                    ? <User className="h-4 w-4 text-white" />
                    : <Bot className="h-4 w-4 text-slate-600" />}
                </div>
                <div className={cn(
                  'rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-prose',
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border text-slate-800 rounded-tl-sm shadow-sm'
                )}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-slate-600" />
                </div>
                <div className="bg-white border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <span className="flex gap-1">
                    <span className="animate-bounce h-1.5 w-1.5 bg-slate-400 rounded-full" style={{ animationDelay: '0ms' }} />
                    <span className="animate-bounce h-1.5 w-1.5 bg-slate-400 rounded-full" style={{ animationDelay: '150ms' }} />
                    <span className="animate-bounce h-1.5 w-1.5 bg-slate-400 rounded-full" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-white p-4">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              {messages.length > 0 && (
                <Button type="button" variant="outline" onClick={resetChat}>
                  New chat
                </Button>
              )}
            </form>
          </div>
        </div>

        {lead && (
          <aside className="w-64 border-l bg-white p-4 space-y-3 overflow-y-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Detected lead
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{lead.fullName ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p>{lead.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p>{lead.phone ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="secondary">{lead.status}</Badge>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
