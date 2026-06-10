"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const badges = [
  { icon: "👆", title: "Biometric Auth", desc: "Fingerprint & face unlock. No password needed." },
  { icon: "⛓️", title: "Blockchain KYC", desc: "Identity verified on-chain. Tamper-proof forever." },
  { icon: "🔒", title: "Certificate Pinning", desc: "Prevents man-in-the-middle attacks on all API calls." },
  { icon: "🚫", title: "Screenshot Prevention", desc: "Sensitive screens are protected from screen capture." },
];

export default function Security() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 max-w-6xl mx-auto" id="security">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Security</p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-1px" }}>
          Your money is safe.
        </h2>
        <p className="max-w-lg mx-auto" style={{ color: "var(--muted)", fontSize: "17px" }}>
          We built futureBank with bank-grade security from day one — not as an afterthought.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b, i) => (
          <motion.div key={b.title}
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="fb-card p-6 text-center">
            <div className="text-3xl mb-4">{b.icon}</div>
            <h3 className="font-bold mb-2">{b.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
