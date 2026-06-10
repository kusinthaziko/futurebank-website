"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../../lib/cn";

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
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#060D1Adc] backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <img src="/icon.png" alt="futureBank" className="w-9 h-9 rounded-xl" />
        <span className="font-bold text-lg">futureBank</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={cn("text-sm font-medium transition-colors hover:text-white",
              path === l.href ? "text-white" : "text-[var(--muted)]")}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/#download"
          className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, var(--teal), var(--teal-light))" }}>
          Download
        </Link>
        <button onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-[var(--muted)] text-lg">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="absolute top-full inset-x-0 flex flex-col border-b border-[var(--border)] md:hidden"
          style={{ background: "rgba(6,13,26,0.98)" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={cn("px-6 py-3 text-sm font-medium",
                path === l.href ? "text-white" : "text-[var(--muted)]")}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
