"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { n: "01", title: "Register with your student ID", desc: "Sign up using your university email and student ID. Takes 2 minutes." },
  { n: "02", title: "Complete KYC verification", desc: "Upload your student ID card for verification. Takes 2 minutes." },
  { n: "03", title: "Start banking", desc: "Deposit, transfer, save, borrow — all from your phone." },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--teal-light)]">How It Works</p>
        <h2 className="font-black mb-12" style={{ fontSize: "clamp(28px,5vw,48px)", letterSpacing: "-1px" }}>Up and running in minutes</h2>
      </motion.div>
      <div className="flex flex-col md:flex-row gap-4">
        {steps.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="flex-1 rounded-3xl border border-[var(--border)] p-8 flex flex-col gap-4 hover:-translate-y-1 hover:border-[var(--teal)] transition-all duration-200"
            style={{ background: "var(--card)" }}>
            <span className="font-black text-[var(--border)]" style={{ fontSize: 56, letterSpacing: "-3px" }}>{s.n}</span>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
