"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/features", label: "Features" },
  { href: "/security", label: "Security" },
  { href: "/docs", label: "Docs" },
  { href: "/ask", label: "Ask AI" },
];

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{ background: "rgba(6,13,26,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,58,95,0.5)" }}>
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xl text-white"
          style={{ background: "linear-gradient(135deg, #0D2F6E, #1A56DB)" }}>f</div>
        <span className="font-bold text-lg">futureBank</span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="text-sm font-medium transition-colors"
            style={{ color: path === l.href ? "white" : "var(--muted)" }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/#download" className="btn-primary text-sm px-5 py-2.5">
          Download
        </Link>
        {/* Mobile menu toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}
          style={{ color: "var(--muted)" }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 py-4 flex flex-col gap-1 md:hidden"
          style={{ background: "rgba(6,13,26,0.98)", borderBottom: "1px solid var(--border)" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="px-6 py-3 text-sm font-medium"
              style={{ color: path === l.href ? "white" : "var(--muted)" }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
