"use client";
import { useState, useRef, useEffect } from "react";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setMessages(m => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "ai", text: data.answer || "Sorry, I couldn't answer that. Try rephrasing." }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col h-[100dvh] pt-16">
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg,var(--blue-mid),var(--blue))" }}>✨</div>
              <h1 className="text-2xl font-black mb-2">Ask futureBank AI</h1>
              <p className="text-[var(--muted)]">Ask anything about the app, your account, or financial advice.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggested.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="px-4 py-2 rounded-full text-sm border border-[var(--border)] text-[var(--muted)] hover:border-[var(--blue)] hover:text-white transition-all"
                  style={{ background: "var(--card)" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: m.role === "user" ? "var(--blue)" : "var(--card)",
                    color: m.role === "user" ? "white" : "var(--muted)",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    border: m.role === "ai" ? "1px solid var(--border)" : "none",
                  }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl border border-[var(--border)] flex gap-1" style={{ background: "var(--card)", borderRadius: "18px 18px 18px 4px" }}>
                  {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--subtle)] animate-blink" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3 max-w-2xl w-full mx-auto" style={{ background: "var(--navy)" }}>
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 px-4 py-3 rounded-full text-sm bg-[var(--card)] border border-[var(--border)] text-white placeholder-[var(--subtle)] outline-none focus:border-[var(--blue)] transition-colors" />
          <button type="submit" disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-full font-bold text-sm text-white disabled:opacity-40 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,var(--blue),var(--blue-light))" }}>
            Send
          </button>
        </form>
        <p className="text-center text-xs text-[var(--subtle)] mt-2">Powered by futureBank AI</p>
      </div>
    </main>
  );
}
