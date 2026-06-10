import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg text-white"
            style={{ background: "linear-gradient(135deg, #0D2F6E, #1A56DB)" }}>f</div>
          <div>
            <div className="font-bold text-sm">futureBank</div>
            <div className="text-xs" style={{ color: "var(--subtle)" }}>Campus financial super-app</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm justify-center" style={{ color: "var(--subtle)" }}>
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link href="/ask" className="hover:text-white transition-colors">Ask AI</Link>
          <a href="mailto:support@futurebank.app" className="hover:text-white transition-colors">Support</a>
        </div>
        <div className="text-xs text-center" style={{ color: "var(--subtle)" }}>
          Made with ❤️ in Malawi 🇲🇼 · © 2026 futureBank
        </div>
      </div>
    </footer>
  );
}
