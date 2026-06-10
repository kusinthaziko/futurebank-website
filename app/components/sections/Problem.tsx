"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const pain = [
  { stat: "73%", label: "of students have no formal bank account", icon: "🏦" },
  { stat: "0",   label: "access to credit or micro-loans on campus", icon: "💳" },
  { stat: "∞",   label: "financial decisions made with zero guidance", icon: "🧭" },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--blue-light)]">The Problem</p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(28px,5vw,48px)", letterSpacing: "-1px" }}>
          Campus students deserve<br />real banking tools.
        </h2>
        <p className="text-lg text-[var(--muted)] max-w-xl mb-12">
          Most university students in Africa are excluded from the formal financial system. futureBank changes that.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pain.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-3xl border border-[var(--border)] p-8 hover:-translate-y-1 hover:border-[var(--blue)] transition-all duration-200"
            style={{ background: "var(--card)" }}>
            <div className="text-4xl mb-4">{p.icon}</div>
            <div className="font-black mb-2 text-[var(--gold)]" style={{ fontSize: 52, letterSpacing: "-2px" }}>{p.stat}</div>
            <p className="text-[var(--muted)] text-sm leading-relaxed">{p.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
