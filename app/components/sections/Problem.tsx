"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const pain = [
  { stat: "73%", label: "of students have no formal bank account", icon: "🏦" },
  { stat: "0", label: "access to credit or micro-loans on campus", icon: "💳" },
  { stat: "∞", label: "financial decisions made with zero guidance", icon: "🧭" },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--blue-light)" }}>
          The Problem
        </p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-1px" }}>
          Campus students deserve<br />real banking tools.
        </h2>
        <p className="mb-12 max-w-xl" style={{ color: "var(--muted)", fontSize: "18px" }}>
          Most university students in Africa are completely excluded from the formal financial system.
          futureBank changes that.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pain.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="fb-card p-8">
            <div className="text-4xl mb-4">{p.icon}</div>
            <div className="font-black mb-2" style={{ fontSize: "48px", color: "var(--gold)", letterSpacing: "-2px" }}>{p.stat}</div>
            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.6" }}>{p.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
