import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { api } from '../services/api.js';
import { assistantIcons } from '../assistants/assistantsMeta.js';
import { useOllamaStatus } from '../hooks/useOllamaStatus.js';
import ChatBubble from '../components/ChatBubble.jsx';

export default function AssistantWorkspace() {
  const { key } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { ready } = useOllamaStatus();

  const [assistant, setAssistant] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const Icon = assistantIcons[key];

  useEffect(() => {
    api.getAssistants().then((list) => {
      const found = list.find((a) => a.key === key);
      setAssistant(found || null);
    });
    api.getLatestConversation(key).then((convo) => {
      if (convo) {
        setConversationId(convo.id);
        setMessages(convo.messages);
      }
    }).catch(() => {});
  }, [key]);

  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt;
    if (initialPrompt) {
      window.history.replaceState({}, '');
      send(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput('');
    setError(null);
    setMessages((m) => [...m, { role: 'user', content, id: `local-${Date.now()}` }]);
    setSending(true);
    try {
      const res = await api.sendMessage({ assistantKey: key, conversationId, message: content });
      setConversationId(res.conversationId);
      setMessages((m) => [...m, { role: 'assistant', content: res.reply, id: `local-${Date.now()}-r` }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const clearConversation = async () => {
    if (conversationId) await api.deleteConversation(conversationId).catch(() => {});
    setConversationId(null);
    setMessages([]);
  };

  if (!assistant) {
    return <div className="mx-auto max-w-3xl px-6 py-10 text-sm text-muted">Loading…</div>;
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-57px)] max-w-3xl flex-col px-4 py-4 sm:h-screen sm:px-6 sm:py-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="focus-ring flex items-center gap-1 rounded text-sm text-muted hover:text-ink">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <button onClick={clearConversation} className="focus-ring flex items-center gap-1 rounded text-sm text-muted hover:text-ink">
          <Trash2 size={15} /> Clear
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
          {Icon && <Icon size={20} strokeWidth={1.75} />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-ink">{assistant.name}</h1>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${ready ? 'bg-accent' : 'bg-amber-400'}`}
              aria-hidden="true"
              title={ready ? 'AI ready' : 'AI unavailable'}
            />
          </div>
          <p className="truncate text-sm text-muted">{assistant.tagline}</p>
        </div>
      </div>

      <div ref={scrollRef} className="my-2 flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-canvas/60 p-5">
            <p className="mb-3 text-sm text-muted">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {assistant.suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="focus-ring rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink transition hover:border-accent/40 hover:bg-accent-soft"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => <ChatBubble key={m.id} role={m.role} content={m.content} icon={Icon} />)}
        {sending && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              {Icon && <Icon size={14} strokeWidth={2} />}
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 shadow-card">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: '150ms' }} />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex items-end gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={`Ask ${assistant.name} something…`}
          rows={1}
          className="focus-ring max-h-32 flex-1 resize-none rounded-lg bg-transparent px-2 py-2 text-sm text-ink"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send message"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-dark disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
