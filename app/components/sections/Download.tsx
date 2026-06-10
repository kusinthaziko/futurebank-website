"use client";
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BASE = "https://github.com/kusinthaziko/futurebank-mobile/releases/latest/download";
const options = [
  { key: "arm64", name: "arm64-v8a", desc: "Modern phones (2017+)", file: "app-arm64-v8a-release.apk" },
  { key: "armv7", name: "armeabi-v7a", desc: "Older 32-bit phones", file: "app-armeabi-v7a-release.apk" },
  { key: "x86",   name: "x86_64",     desc: "Emulators / Chromebooks", file: "app-x86_64-release.apk" },
];

export default function Download() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [detected, setDetected] = useState("arm64");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/armv7|arm;/i.test(ua)) setDetected("armv7");
    else if (/x86_64/i.test(ua)) setDetected("x86");
  }, []);

  return (
    <section ref={ref} id="download" className="py-24 px-6 text-center"
      style={{ background: "linear-gradient(180deg, transparent, rgba(26,86,219,0.06), transparent)" }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto">
        <div className="text-5xl mb-6">📱</div>
        <h2 className="font-black mb-3" style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-1px" }}>
          Ready to take control<br />of your finances?
        </h2>
        <p className="mb-10" style={{ color: "var(--muted)", fontSize: "17px" }}>
          Free for Android. No credit card required.
        </p>

        <div className="flex flex-col gap-3">
          {options.map((o) => (
            <a key={o.key} href={`${BASE}/${o.file}`}
              className="flex items-center justify-between rounded-2xl px-5 py-4 border transition-all duration-200 hover:-translate-y-1"
              style={{
                background: detected === o.key ? "rgba(26,86,219,0.12)" : "var(--card)",
                borderColor: detected === o.key ? "var(--blue)" : "var(--border)",
              }}>
              <div className="text-left">
                <div className="font-semibold">{o.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{o.desc}</div>
              </div>
              {detected === o.key
                ? <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(212,160,23,0.15)", color: "var(--gold)" }}>✓ Best for you</span>
                : <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(26,86,219,0.15)", color: "var(--blue-light)" }}>↓ APK</span>}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
