"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const suggested = [
  "How do I register?",
  "How do transfers work?",
  "How does the AI coach help me?",
  "Is my money safe?",
  "How do I apply for a loan?",
];

type Msg = { role: "user" | "ai"; text: string };

export default function AskPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!streaming) inputRef.current?.focus();
  }, [streaming]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages(m => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setStreaming(true);

    const aiMsg: Msg = { role: "ai", text: "" };
    setMessages(m => [...m, aiMsg]);

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
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-[var(--teal-light)]">$1</code>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-[var(--muted)]">$1</li>')
      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-2 space-y-1">$&</ul>')
      .replace(/^\d\. (.+)$/gm, '<li class="ml-4 list-decimal text-[var(--muted)]">$1</li>')
      .replace(/\n/g, '<br />');
  }

  return (
    <main className="flex flex-col h-dvh pt-16">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] flex-shrink-0" style={{ background: "var(--navy)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
          ✨
        </div>
        <div>
          <div className="text-sm font-semibold">futureBank AI</div>
          <div className="text-xs flex items-center gap-1" style={{ color: "#6EE7B7" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online
          </div>
        </div>
        <Link href="/docs" className="ml-auto text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-white transition-all">
          Docs ↗
        </Link>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60dvh] gap-8 text-center">
              <div>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                  ✨
                </div>
                <h1 className="text-2xl font-black mb-2">Ask futureBank AI</h1>
                <p className="text-[var(--muted)] max-w-sm">
                  Ask anything about the app, your account, or financial advice.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggested.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="px-4 py-2.5 rounded-full text-sm border border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-white transition-all"
                    style={{ background: "var(--card)" }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1"
                      style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                      ✨
                    </div>
                  )}
                  <div
                    className="text-sm leading-relaxed px-4 py-3 max-w-[85%]"
                    style={{
                      background: m.role === "user" ? "var(--teal)" : "var(--card)",
                      color: m.role === "user" ? "white" : "var(--muted)",
                      borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      border: m.role === "ai" ? "1px solid var(--border)" : "none",
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
                  />
                </div>
              ))}
              {loading && !messages[messages.length - 1]?.text && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                    ✨
                  </div>
                  <div className="px-4 py-3 rounded-2xl border border-[var(--border)] flex gap-1"
                    style={{ background: "var(--card)", borderRadius: "18px 18px 18px 4px" }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--subtle)] animate-blink"
                        style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] flex-shrink-0" style={{ background: "var(--navy)" }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              enterKeyHint="send"
              autoComplete="off"
              className="flex-1 px-5 py-3 rounded-full text-sm bg-[var(--card)] border border-[var(--border)] text-white placeholder-[var(--subtle)] outline-none focus:border-[var(--teal)] transition-colors"
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-light))" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs text-[var(--subtle)] mt-2">Powered by futureBank AI</p>
        </div>
      </div>
    </main>
  );
}
