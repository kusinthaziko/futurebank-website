"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const suggested = [
  "How do I register?",
  "How do transfers work?",
  "Is my money safe?",
];

type Msg = { role: "user" | "ai"; text: string };

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!streaming) inputRef.current?.focus();
  }, [streaming]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Prevent body scroll when chat open on mobile
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  // Mobile keyboard handling
  useEffect(() => {
    if (!open || !window.visualViewport) return;
    const origHeight = window.visualViewport.height;
    const handler = () => {
      if (!panelRef.current) return;
      const currentHeight = window.visualViewport!.height;
      const keyboardH = origHeight - currentHeight;
      if (keyboardH > 50) {
        panelRef.current.style.height = currentHeight + "px";
      } else {
        panelRef.current.style.height = "";
      }
    };
    window.visualViewport.addEventListener("resize", handler);
    return () => window.visualViewport?.removeEventListener("resize", handler);
  }, [open]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages(m => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setStreaming(true);

    setMessages(m => [...m, { role: "ai", text: "" }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                fullText += data.chunk;
                setMessages(m => {
                  const updated = [...m];
                  const last = updated[updated.length - 1];
                  if (last?.role === "ai") updated[updated.length - 1] = { ...last, text: fullText };
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setMessages(m => {
        const updated = [...m];
        const last = updated[updated.length - 1];
        if (last?.role === "ai") updated[updated.length - 1] = { ...last, text: "Connection error. Please try again." };
        return updated;
      });
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  function renderMarkdown(text: string) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/`(.+?)`/g, '<code class="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-[var(--teal-light)]">$1</code>')
      .replace(/^- (.+)$/gm, '<li class="ml-3 list-disc text-[var(--muted)]">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-1 space-y-0.5">$&</ul>')
      .replace(/\n/g, '<br />');
  }

  return (
    <>
      {/* Bubble trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--teal), var(--teal-light))",
          boxShadow: "0 8px 32px rgba(0,105,92,0.4)",
          display: open ? "none" : "flex",
          width: "52px",
          height: "52px",
        }}
        aria-label="Ask AI"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat panel */}
      <div
        ref={panelRef}
        className={`fixed inset-0 md:inset-auto md:bottom-24 md:right-6 z-50 w-full md:w-96 md:rounded-2xl border border-[var(--border)] flex flex-col overflow-hidden transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        style={{
          background: "var(--navy)",
          height: open ? "100%" : "auto",
          maxHeight: open ? "100%" : "0",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] flex-shrink-0" style={{ background: "var(--surface)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
              ✨
            </div>
            <div>
              <div className="text-sm font-semibold">AI Assistant</div>
              <div className="text-xs flex items-center gap-1" style={{ color: "#6EE7B7" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/ask" className="text-xs text-[var(--subtle)] hover:text-white transition-colors p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <button onClick={() => setOpen(false)} className="text-[var(--subtle)] hover:text-white transition-colors p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1"
                  style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                  ✨
                </div>
                <div className="text-sm leading-relaxed px-3 py-2 max-w-xs" style={{ background: "var(--card)", borderRadius: "16px 16px 16px 4px", color: "var(--muted)" }}>
                  Hi! I can help you with futureBank. Ask me anything about accounts, transfers, loans, or security.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggested.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)] text-[var(--subtle)] hover:border-[var(--teal)] hover:text-white transition-all">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "ai" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-1"
                      style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                      ✨
                    </div>
                  )}
                  <div
                    className="text-sm leading-relaxed px-3 py-2 max-w-[80%]"
                    style={{
                      background: m.role === "user" ? "var(--teal)" : "var(--card)",
                      color: m.role === "user" ? "white" : "var(--muted)",
                      borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      border: m.role === "ai" ? "1px solid var(--border)" : "none",
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
                  />
                </div>
              ))}
              {loading && !messages[messages.length - 1]?.text && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                    ✨
                  </div>
                  <div className="px-3 py-2 rounded-2xl border border-[var(--border)] flex gap-1" style={{ background: "var(--card)", borderRadius: "16px 16px 16px 4px" }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--subtle)] animate-blink" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[var(--border)] flex-shrink-0" style={{ background: "var(--surface)" }}>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              enterKeyHint="send"
              autoComplete="off"
              className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2 text-sm text-white placeholder-[var(--subtle)] outline-none focus:border-[var(--teal)] transition-colors"
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-light))" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
