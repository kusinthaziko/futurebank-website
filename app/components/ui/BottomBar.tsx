"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BottomBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const download = document.getElementById("download");
    if (!download) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0.3 });
    obs.observe(download);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}
      style={{ background: "rgba(6,13,26,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", padding: "12px 24px calc(12px + env(safe-area-inset-bottom))" }}>
      <Link href="/#download" className="btn-primary w-full justify-center">
        ⬇ Download futureBank — Free
      </Link>
    </div>
  );
}
