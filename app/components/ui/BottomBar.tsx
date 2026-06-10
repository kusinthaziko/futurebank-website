"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BottomBar() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = document.getElementById("download");
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`md:hidden fixed bottom-0 inset-x-0 z-40 px-6 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 border-t border-[var(--border)] backdrop-blur-xl transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ background: "rgba(6,13,26,0.95)" }}>
      <Link href="/#download"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-white text-base transition-all active:scale-95"
        style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-light))", boxShadow: "0 8px 32px rgba(0,105,92,0.35)" }}>
        ⬇ Download futureBank — Free
      </Link>
    </div>
  );
}
