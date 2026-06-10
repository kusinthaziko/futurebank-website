"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

const PhoneCanvas = dynamic(() => import("../three/PhoneCanvas"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 pt-24 pb-20 max-w-7xl mx-auto overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* Blue radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(26,86,219,0.12) 0%, transparent 70%)" }} />

      {/* Text */}
      <div className="flex-1 z-10 text-center lg:text-left">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
          style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", color: "var(--gold)" }}>
          🇲🇼 Built for African students
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black leading-tight tracking-tight mb-5"
          style={{ fontSize: "clamp(38px, 8vw, 72px)", letterSpacing: "-2px" }}>
          Your campus.<br />
          <span className="gradient-text">Your bank.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg lg:text-xl leading-relaxed mb-8 max-w-xl"
          style={{ color: "var(--muted)" }}>
          The financial super-app built for African university students.
          Savings, transfers, micro-loans, and AI-powered coaching — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/#download" className="btn-primary">⬇ Download Free</Link>
          <Link href="/features" className="btn-ghost">See how it works →</Link>
        </motion.div>
      </div>

      {/* 3D Phone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 w-full lg:w-auto"
        style={{ height: "clamp(420px, 55vw, 600px)" }}>
        <PhoneCanvas />
      </motion.div>
    </section>
  );
}
