"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const starters = [
  "How do I register?",
  "How do transfers work?",
  "How does the AI coach help me?",
  "Is my money safe?",
  "How do I apply for a loan?",
  "What are the loan limits?",
];

type Msg = {
  role: "user" | "ai";
  text: string;
  suggestions?: string[];
};

export default function AskPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter
  const streamTargetRef = useRef("");
  const typewriterIdxRef = useRef(0);
  const typewriterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterResolveRef = useRef<(() => void) | null>(null);

  // Cleanup typewriter timer on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) {
        clearTimeout(typewriterTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typewriterText, loading]);

  const clearTypewriter = useCallback(() => {
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
    typewriterIdxRef.current = streamTargetRef.current.length;
    setTypewriterText(streamTargetRef.current);
    setShowCursor(false);
  }, []);

  const runTypewriter = useCallback(() => {
    const target = streamTargetRef.current;
    if (typewriterIdxRef.current >= target.length) {
      setShowCursor(false);
      // Resolve the promise that send() might be awaiting
      typewriterResolveRef.current?.();
      typewriterResolveRef.current = null;
      return;
    }

    const charsToAdd = Math.min(
      1 + Math.floor(Math.random() * 2),
      target.length - typewriterIdxRef.current
    );
    typewriterIdxRef.current += charsToAdd;
    setTypewriterText(target.slice(0, typewriterIdxRef.current));
    setShowCursor(true);

    typewriterTimerRef.current = setTimeout(runTypewriter, 20 + Math.random() * 15);
  }, []);

  const startTypewriter = useCallback(() => {
    if (typewriterTimerRef.current === null) {
      runTypewriter();
    }
  }, [runTypewriter]);

  const send = useCallback(async (question: string) => {
    if (!question.trim() || loading) return;

    // Push user message and empty AI message immediately
    setMessages(m => [
      ...m,
      { role: "user", text: question },
      { role: "ai", text: "" },
    ]);
    setInput("");

    setLoading(true);
    setStreaming(true);
    streamTargetRef.current = "";
    typewriterIdxRef.current = 0;
    setTypewriterText("");
    setShowCursor(false);

    const ac = new AbortController();
    setAbortController(ac);

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
                streamTargetRef.current += data.chunk;
                startTypewriter();
              }
              if (data.done) {
                finalSuggestions = data.suggestions || [];
              }
            } catch { /* skip */ }
          }
        }
      }

      // Wait for typewriter to finish
      const hasContent = streamTargetRef.current.length > 0;
      if (hasContent) {
        await new Promise<void>(resolve => {
          typewriterResolveRef.current = resolve;
          // If typewriter already finished, resolve immediately
          if (typewriterIdxRef.current >= streamTargetRef.current.length) {
            resolve();
            typewriterResolveRef.current = null;
          }
        });
      }

      const finalText = streamTargetRef.current || "No response received.";

      // Update the last AI message with final text
      setMessages(m => {
        const updated = [...m];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === "ai" && !updated[i].text) {
            updated[i] = { ...updated[i], text: finalText, suggestions: finalSuggestions };
            break;
          }
        }
        return updated;
      });
    } catch (err) {
      clearTypewriter();

      const errorText =
        err instanceof DOMException && err.name === "AbortError"
          ? streamTargetRef.current || "⏸️ Stopped."
          : "Connection error. Please try again.";

      setMessages(m => {
        const updated = [...m];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === "ai" && !updated[i].text) {
            updated[i] = { ...updated[i], text: errorText };
            break;
          }
        }
        return updated;
      });
    } finally {
      setLoading(false);
      setStreaming(false);
      setAbortController(null);
      clearTypewriter();
    }
  }, [loading, startTypewriter, clearTypewriter]);

  const stop = useCallback(() => {
    abortController?.abort();
    clearTypewriter();
  }, [abortController, clearTypewriter]);

  const retry = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      // Remove everything from the last user message onward
      const idx = messages.lastIndexOf(lastUserMsg);
      setMessages(m => m.slice(0, idx));
      send(lastUserMsg.text);
    }
  }, [messages, send]);

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
    <main className="flex flex-col h-dvh">
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {messages.length === 0 ? (
            /* Welcome screen */
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
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {starters.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="px-4 py-2.5 rounded-full text-sm border border-[var(--border)] text-[var(--muted)] hover:border-[var(--teal)] hover:text-white transition-all active:scale-95"
                    style={{ background: "var(--card)" }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => {
                const isLastAi = i === messages.length - 1 && m.role === "ai";
                const displayText = isLastAi && streaming && !m.text ? typewriterText : m.text;
                const isTyping = isLastAi && streaming && showCursor;

                return (
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
                          }}>
                          {displayText ? (
                            <>
                              <span dangerouslySetInnerHTML={{ __html: renderMarkdown(displayText) }} />
                              {isTyping && (
                                <span className="inline-block w-[2px] h-[1em] ml-0.5 align-text-bottom animate-pulse"
                                  style={{ background: "var(--teal)" }} />
                              )}
                            </>
                          ) : isLastAi && streaming ? (
                            <span className="inline-flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--subtle)] animate-bounce" style={{ animationDelay: "0s" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--subtle)] animate-bounce" style={{ animationDelay: "0.15s" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--subtle)] animate-bounce" style={{ animationDelay: "0.3s" }} />
                            </span>
                          ) : (
                            <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text || "") }} />
                          )}
                        </div>

                        {/* Follow-up suggestions */}
                        {m.role === "ai" && m.suggestions && m.suggestions.length > 0 && !streaming && (
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {m.suggestions.map(s => (
                              <button key={s} onClick={() => send(s)}
                                className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)] text-[var(--subtle)] hover:border-[var(--teal)] hover:text-white transition-all active:scale-95">
                                {s} →
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Retry for AI messages */}
                        {m.role === "ai" && !streaming && m.text && (
                          <div className="flex items-center gap-1 pl-1">
                            <button onClick={retry}
                              className="p-1 rounded text-[var(--subtle)] hover:text-white transition-colors"
                              title="Retry">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] flex-shrink-0" style={{ background: "var(--navy)" }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <form onSubmit={e => { e.preventDefault(); if (!streaming) send(input); }} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              enterKeyHint="send"
              autoComplete="off"
              disabled={loading}
              className="flex-1 px-5 py-3 rounded-full text-sm bg-[var(--card)] border border-[var(--border)] text-white placeholder-[var(--subtle)] outline-none focus:border-[var(--teal)] transition-colors disabled:opacity-50"
            />
            {streaming || loading ? (
              <button type="button" onClick={stop}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#EF4444" }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-light))" }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
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
