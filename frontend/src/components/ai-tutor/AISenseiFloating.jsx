import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../../utils/api';
import { FiSend, FiX, FiMaximize2 } from 'react-icons/fi';

export default function AISenseiFloating() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Greetings! Ask me a quick question, or open the **full Sensei page** for deeper training plans." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Hide the floating widget on the full AI Sensei page itself
  if (location.pathname === '/ai-sensei') return null;

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: q, history: messages.slice(-6) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'The Sensei is resting. Please try again shortly.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Orb Button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="ai-orb fixed bottom-6 right-6 z-40 flex items-center justify-center text-2xl"
          style={{ zIndex: 60 }}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          aria-label="Open AI Sensei chat"
        >
          ⚔
        </motion.button>
      )}

      {/* Chat Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="glass-modal fixed bottom-6 right-6 w-[90vw] max-w-sm rounded-2xl flex flex-col overflow-hidden"
            style={{ height: '70vh', maxHeight: 560, zIndex: 60 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--accent)' }}>⚔</span>
                <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>AI Sensei</span>
              </div>
              <div className="flex gap-2">
                <Link to="/ai-sensei" onClick={() => setOpen(false)} style={{ color: 'var(--text-secondary)' }} title="Full screen">
                  <FiMaximize2 size={16} />
                </Link>
                <button onClick={() => setOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
                       style={{ color: 'var(--text-primary)' }}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown components={{ p: ({children}) => <p className="mb-1 last:mb-0">{children}</p> }}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-bubble-ai p-3 inline-flex gap-1.5">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--card-border)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask a quick question..."
                className="input-custom text-sm flex-1"
              />
              <button onClick={send} disabled={loading || !input.trim()} className="btn-primary px-3" style={{ opacity: loading || !input.trim() ? 0.5 : 1 }}>
                <FiSend size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
