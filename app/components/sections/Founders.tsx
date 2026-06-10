"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const founders = [
  { name: "Timothy Chalira", role: "Founder & CEO", bio: "Driving the vision of accessible campus finance across Africa.", handle: "TimothyChalira" },
  { name: "Redson Ngwira", role: "Co-Founder & CTO", bio: "Full-stack engineer building the product end to end.", handle: "RedsoNNgwira" },
];

export default function Founders() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--blue-light)" }}>The Team</p>
        <h2 className="font-black mb-12" style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1px" }}>
          Built by students,<br />for students
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {founders.map((f, i) => (
          <motion.div key={f.name}
            initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="fb-card p-7 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black"
              style={{ background: "rgba(26,86,219,0.2)", color: "var(--blue-light)" }}>
              {f.name[0]}
            </div>
            <div>
              <div className="font-bold text-lg">{f.name}</div>
              <div className="text-sm mb-2" style={{ color: "var(--blue-light)" }}>{f.role}</div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--muted)" }}>{f.bio}</p>
              <a href={`https://x.com/${f.handle}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-75"
                style={{ background: "rgba(29,161,242,0.1)", color: "#1DA1F2", border: "1px solid rgba(29,161,242,0.2)" }}>
                𝕏 @{f.handle}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
