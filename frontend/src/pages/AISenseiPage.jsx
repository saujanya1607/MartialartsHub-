import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api';
import { FiSend, FiTrash2, FiZap } from 'react-icons/fi';

const EXAMPLE_QUESTIONS = [
  'What is Muay Thai?',
  'Difference between Judo and BJJ?',
  'Best martial art for self-defense?',
  'Explain the Roundhouse Kick.',
  'Create a Kendo study plan for beginners.',
  'Compare Wing Chun vs Kung Fu.',
  'What books should I read for Taekwondo?',
  'History of Kalaripayattu?',
];

export default function AISenseiPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "**Greetings, student.** I am the **Martial Arts Sensei** — an AI trained in the ways of every fighting tradition on Earth.\n\nAsk me anything: the history of Kalaripayattu, the difference between Judo and BJJ, or how to create your personal training plan. The path to mastery begins with a question.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-10); // send last 10 messages as context
      const { data } = await api.post('/ai/chat', { message: q, history });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Apologies, the Sensei is temporarily unavailable. Please try again shortly.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Martial Arts Sensei — MartialHub</title>
      </Helmet>

      <div className="pt-16 min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="text-center py-8 px-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
          <div className="ai-orb mx-auto mb-4" style={{ width: 50, height: 50 }} />
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Martial Arts <span style={{ color: 'var(--accent)' }}>Sensei</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            AI-powered knowledge of every martial art on Earth
          </p>
        </div>

        {/* Example Questions */}
        {messages.length <= 1 && (
          <div className="px-4 py-6 max-w-3xl mx-auto w-full">
            <p className="text-xs font-display tracking-widest mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              TRY ASKING
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="glass tag text-sm px-4 py-2 rounded-full text-left hover:border-accent transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm"
                       style={{ background: 'rgba(var(--accent-rgb),0.2)', color: 'var(--accent)' }}>
                    ⚔
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      className="prose prose-sm max-w-none"
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0" style={{ color: 'var(--text-primary)' }}>{children}</p>,
                        strong: ({children}) => <strong style={{ color: 'var(--accent)' }}>{children}</strong>,
                        h1: ({children}) => <h1 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h1>,
                        h2: ({children}) => <h2 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h2>,
                        h3: ({children}) => <h3 className="font-display font-semibold mb-1" style={{ color: 'var(--accent)' }}>{children}</h3>,
                        ul: ({children}) => <ul className="list-disc pl-4 mb-2" style={{ color: 'var(--text-secondary)' }}>{children}</ul>,
                        li: ({children}) => <li className="mb-1">{children}</li>,
                        code: ({children}) => <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(var(--accent-rgb),0.15)', color: 'var(--accent)' }}>{children}</code>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                   style={{ background: 'rgba(var(--accent-rgb),0.2)', color: 'var(--accent)' }}>⚔</div>
              <div className="chat-bubble-ai p-4 flex gap-1.5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="px-4 py-4 max-w-3xl mx-auto w-full" style={{ borderTop: '1px solid var(--card-border)' }}>
          <div className="flex gap-3">
            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              className="glass p-3 rounded-xl flex-shrink-0"
              style={{ color: 'var(--text-secondary)' }}
              title="Clear conversation"
            >
              <FiTrash2 size={18} />
            </button>
            <div className="flex-1 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask the Sensei anything about martial arts..."
                className="input-custom flex-1"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="btn-primary px-5 flex items-center gap-2 flex-shrink-0"
                style={{ opacity: loading || !input.trim() ? 0.5 : 1 }}
              >
                <FiSend size={16} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
            <FiZap size={10} style={{ display: 'inline', marginRight: 4 }} />
            Powered by Gemini AI · Not a substitute for professional instruction
          </p>
        </div>
      </div>
    </>
  );
}
