"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const starter = [
  "How do I register?",
  "How do transfers work?",
  "How does the AI coach help me?",
  "Is my money safe?",
  "How do I apply for a loan?",
];

type Source = { title: string; slug: string };
type Msg = {
  role: "user" | "ai";
  text: string;
  confidence?: "high" | "medium" | "low";
  sources?: Source[];
  suggestions?: string[];
  feedback?: "up" | "down";
};

export default function AskPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const editIndexRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (question: string) => {
    if (!question.trim() || loading) return;

    setMessages(m => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setStreaming(true);
    editIndexRef.current = null;

    const ac = new AbortController();
    setAbortController(ac);

    const aiMsg: Msg = { role: "ai", text: "" };
    setMessages(m => [...m, aiMsg]);

    try {
      const res = await fetch("/api/ask", {
        signal: ac.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let finalConfidence: "high" | "medium" | "low" | undefined;
      let finalSources: Source[] = [];
      let finalSuggestions: string[] = [];

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
              if (data.done) {
                finalConfidence = data.confidence;
                finalSources = data.sources || [];
                finalSuggestions = data.suggestions || [];
              }
            } catch { /* skip */ }
          }
        }
      }

      setMessages(m => {
        const updated = [...m];
        const last = updated[updated.length - 1];
        if (last?.role === "ai") {
          updated[updated.length - 1] = {
            ...last,
            text: fullText || "No response received.",
            confidence: finalConfidence,
            sources: finalSources,
            suggestions: finalSuggestions,
          };
        }
        return updated;
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setMessages(m => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          if (last?.role === "ai" && !last.text) {
            updated[updated.length - 1] = { ...last, text: "⏸️ Stopped." };
          }
          return updated;
        });
      } else {
        setMessages(m => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          if (last?.role === "ai") updated[updated.length - 1] = { ...last, text: "Connection error. Please try again." };
          return updated;
        });
      }
    } finally {
      setLoading(false);
      setStreaming(false);
      setAbortController(null);
    }
  }, [loading]);

  const stop = useCallback(() => {
    abortController?.abort();
  }, [abortController]);

  const retry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      // Remove the failed AI message and last user message, resend
      const idx = messages.lastIndexOf(lastUserMsg);
      setMessages(m => m.slice(0, idx));
      send(lastUserMsg.text);
    }
  }, [messages, send]);

  const editMessage = useCallback((text: string) => {
    setInput(text);
    inputRef.current?.focus();
  }, []);

  const giveFeedback = useCallback((idx: number, type: "up" | "down") => {
    setMessages(m => {
      const updated = [...m];
      const msg = updated[idx];
      if (msg?.role === "ai") {
        updated[idx] = { ...msg, feedback: msg.feedback === type ? undefined : type };
      }
      return updated;
    });
  }, []);

  function getConfidenceColor(confidence?: "high" | "medium" | "low") {
    switch (confidence) {
      case "high": return "#6EE7B7";
      case "medium": return "#FFB300";
      case "low": return "#EF4444";
      default: return "var(--subtle)";
    }
  }

  function getConfidenceLabel(confidence?: "high" | "medium" | "low") {
    switch (confidence) {
      case "high": return "Verified from docs";
      case "medium": return "Based on knowledge base";
      case "low": return "Uncertain answer";
      default: return "";
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
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
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
                {starter.map(q => (
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
                <div key={i} className="flex flex-col gap-2">
                  <div className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    {m.role === "ai" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1"
                        style={{ background: "linear-gradient(135deg, var(--teal-dark), var(--teal))" }}>
                        ✨
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5 max-w-[85%]">
                      <div
                        className="text-sm leading-relaxed px-4 py-3"
                        style={{
                          background: m.role === "user" ? "var(--teal)" : "var(--card)",
                          color: m.role === "user" ? "white" : "var(--muted)",
                          borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          border: m.role === "ai" ? "1px solid var(--border)" : "none",
                        }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
                      />

                      {/* Confidence indicator */}
                      {m.role === "ai" && m.confidence && !streaming && (
                        <div className="flex items-center gap-1.5 px-1">
                          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: getConfidenceColor(m.confidence) }} />
                          <span className="text-[10px]" style={{ color: "var(--subtle)" }}>{getConfidenceLabel(m.confidence)}</span>
                        </div>
                      )}

                      {/* Sources */}
                      {m.role === "ai" && m.sources && m.sources.length > 0 && !streaming && (
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {m.sources.map(s => (
                            <Link key={s.slug} href={`/docs/${s.slug}`}
                              className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--border)] hover:border-[var(--teal)] hover:text-white transition-all"
                              style={{ color: "var(--subtle)" }}>
                              📄 {s.title}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Actions: feedback + retry + edit */}
                      {m.role === "ai" && !streaming && (
                        <div className="flex items-center gap-1 px-1">
                          <button onClick={() => giveFeedback(i, "up")}
                            className={`p-1 rounded transition-colors ${m.feedback === "up" ? "text-[var(--teal-light)]" : "text-[var(--subtle)] hover:text-white"}`}
                            title="Helpful">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          </button>
                          <button onClick={() => giveFeedback(i, "down")}
                            className={`p-1 rounded transition-colors ${m.feedback === "down" ? "text-red-400" : "text-[var(--subtle)] hover:text-white"}`}
                            title="Not helpful">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                          </button>
                          <button onClick={retry}
                            className="p-1 rounded text-[var(--subtle)] hover:text-white transition-colors"
                            title="Retry">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Edit button for user messages */}
                      {m.role === "user" && !streaming && (
                        <div className="flex justify-end px-1">
                          <button onClick={() => editMessage(m.text)}
                            className="p-1 rounded text-[var(--subtle)] hover:text-white transition-colors"
                            title="Edit">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Follow-up suggestions */}
                  {m.role === "ai" && m.suggestions && m.suggestions.length > 0 && !streaming && (
                    <div className="flex flex-wrap gap-1.5 pl-10">
                      {m.suggestions.map(s => (
                        <button key={s} onClick={() => send(s)}
                          className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)] text-[var(--subtle)] hover:border-[var(--teal)] hover:text-white transition-all">
                          {s} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading dots */}
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
            {streaming ? (
              <button type="button" onClick={stop}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#EF4444" }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button type="submit" disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-light))" }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            )}
          </form>
          <p className="text-center text-xs text-[var(--subtle)] mt-2">Powered by futureBank AI</p>
        </div>
      </div>
    </main>
  );
}
