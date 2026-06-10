"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

const convo = [
  { role: "user", text: "How much did I spend on food last month?" },
  { role: "ai",   text: "You spent MWK 12,400 on food — 28% of your expenses. That's slightly above your 25% goal. Want tips to reduce it?" },
  { role: "user", text: "Yes please" },
  { role: "ai",   text: "Try cooking 3 more meals per week. That could save ~MWK 2,000/month and put you back on track. 📈" },
];

export default function AiSpotlight() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setShown(n => n < convo.length ? n + 1 : n), 1100);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section ref={ref} className="py-20 px-6" style={{ background: "linear-gradient(180deg,transparent,rgba(26,86,219,0.05),transparent)" }}>
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <motion.div initial={{ opacity: 0, x: -32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>AI Financial Coach</p>
          <h2 className="font-black mb-4" style={{ fontSize: "clamp(26px,4vw,42px)", letterSpacing: "-1px" }}>
            Your personal<br />financial advisor
          </h2>
          <p className="text-[var(--muted)] text-lg leading-relaxed mb-6">
            The AI coach analyses your spending, tracks your goals, and gives personalised advice — 24/7, for free.
          </p>
          <Link href="/ask"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-[var(--muted)] border border-[var(--border)] transition-all hover:border-[var(--blue)] hover:text-white">
            Try asking it something →
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-md">
          <div className="rounded-3xl border border-[var(--border)] p-5 flex flex-col gap-3 min-h-[280px]" style={{ background: "var(--surface)" }}>
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{ background: "linear-gradient(135deg,var(--blue-mid),var(--blue))" }}>✨</div>
              <span className="text-sm font-semibold">AI Coach</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(13,155,100,0.15)", color: "#6EE7B7" }}>Online</span>
            </div>
            {convo.slice(0, shown).map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: m.role === "user" ? "var(--blue)" : "var(--card)",
                    color: m.role === "user" ? "white" : "var(--muted)",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  }}>{m.text}</div>
              </motion.div>
            ))}
            {shown < convo.length && inView && (
              <div className="flex gap-1 px-1">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full animate-blink bg-[var(--subtle)]" style={{ animationDelay: `${i*0.2}s` }} />)}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
