"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const features = [
  { icon: "🤖", title: "AI Financial Coach", desc: "Personalised spending insights and financial guidance powered by AI.", wide: true, color: "rgba(26,86,219,0.15)" },
  { icon: "💸", title: "Instant Transfers", desc: "Send money to any student in seconds.", wide: false, color: "rgba(13,155,100,0.15)" },
  { icon: "📈", title: "Financial Health Score", desc: "Real-time score with personalised recommendations.", wide: false, color: "rgba(212,160,23,0.15)" },
  { icon: "🏆", title: "Savings Challenges", desc: "Compete with friends and climb the leaderboard.", wide: false, color: "rgba(124,58,237,0.15)" },
  { icon: "🔐", title: "Bank-Grade Security", desc: "Biometrics, blockchain KYC, certificate pinning, screenshot prevention.", wide: true, color: "rgba(220,38,38,0.15)" },
  { icon: "💳", title: "Micro-Loans", desc: "Apply for campus loans in minutes.", wide: false, color: "rgba(26,86,219,0.15)" },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 max-w-6xl mx-auto" id="features">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--blue-light)" }}>Features</p>
        <h2 className="font-black mb-12" style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-1px" }}>
          Everything students need<br />to manage money
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`fb-card p-7 ${f.wide ? "md:col-span-2" : ""}`}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: f.color }}>
              {f.icon}
            </div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mt-10">
        <Link href="/features" className="btn-ghost">See all features →</Link>
      </motion.div>
    </section>
  );
}
