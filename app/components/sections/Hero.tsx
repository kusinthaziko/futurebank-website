"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

const PhoneCanvas = dynamic(() => import("../three/PhoneCanvas"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 pt-28 pb-24 max-w-7xl mx-auto overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "linear-gradient(rgba(30,58,95,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(30,58,95,0.4) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 55% 55% at 25% 50%, rgba(26,86,219,0.14) 0%, transparent 70%)" }} />

      <div className="flex-1 z-10 text-center lg:text-left">
        <motion.span initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
          style={{ background:"rgba(212,160,23,0.12)", border:"1px solid rgba(212,160,23,0.35)", color:"var(--gold)" }}>
          🇲🇼 Built for African students
        </motion.span>

        <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
          className="font-black leading-[1.08] mb-5"
          style={{ fontSize:"clamp(40px,8vw,76px)", letterSpacing:"-2.5px" }}>
          Your campus.<br />
          <span className="gradient-text">Your bank.</span>
        </motion.h1>

        <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
          className="text-lg lg:text-xl leading-relaxed mb-8 max-w-xl text-[var(--muted)]">
          The financial super-app built for African university students.
          Savings, transfers, micro-loans, and AI coaching — all in one place.
        </motion.p>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.3 }}
          className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link href="/#download"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-white text-base transition-all hover:-translate-y-1 active:scale-95"
            style={{ background:"linear-gradient(135deg,var(--blue),var(--blue-light))", boxShadow:"0 8px 32px rgba(26,86,219,0.4)" }}>
            ⬇ Download Free
          </Link>
          <Link href="/features"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base text-[var(--muted)] border border-[var(--border)] transition-all hover:border-[var(--blue)] hover:text-white">
            See how it works →
          </Link>
        </motion.div>
      </div>

      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.15 }}
        className="flex-1 w-full" style={{ height:"clamp(400px,55vw,600px)" }}>
        <PhoneCanvas />
      </motion.div>
    </section>
  );
}
