"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  { n: "01", title: "Register with your student ID", desc: "Sign up using your university email and student ID. Takes 2 minutes." },
  { n: "02", title: "Complete KYC verification", desc: "Upload your student card. Verified on-chain using blockchain identity." },
  { n: "03", title: "Start banking", desc: "Deposit, transfer, save, borrow — all from your phone." },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center" style={{ color: "var(--blue-light)" }}>How It Works</p>
        <h2 className="font-black mb-16 text-center" style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-1px" }}>
          Up and running in minutes
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row items-stretch gap-0">
        {steps.map((s, i) => (
          <div key={s.n} className="flex-1 flex flex-col md:flex-row items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex-1 fb-card p-8 flex flex-col gap-4">
              <span className="font-black text-5xl" style={{ color: "var(--border)", letterSpacing: "-2px" }}>{s.n}</span>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{s.desc}</p>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center px-3">
                <div className="w-8 h-0.5 rounded" style={{ background: "var(--border)" }} />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent"
                  style={{ borderLeftColor: "var(--border)" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
