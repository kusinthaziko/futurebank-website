import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg text-white"
            style={{ background: "linear-gradient(135deg, var(--blue-mid), var(--blue))" }}>f</div>
          <div>
            <div className="font-bold text-sm">futureBank</div>
            <div className="text-xs text-[var(--subtle)]">Campus financial super-app</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-[var(--subtle)] justify-center">
          {[
            { href: "/features", label: "Features" },
            { href: "/security", label: "Security" },
            { href: "/docs", label: "Docs" },
            { href: "/ask", label: "Ask AI" },
            { href: "mailto:support@futurebank.app", label: "Support" },
          ].map(l => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
          ))}
        </div>
        <p className="text-xs text-[var(--subtle)] text-center">Made with ❤️ in Malawi 🇲🇼 · © 2026 futureBank</p>
      </div>
    </footer>
  );
}
