import Link from "next/link";

const docs = [
  { slug: "getting-started", title: "Getting Started", desc: "Register, verify your identity, and make your first transaction.", icon: "🚀" },
  { slug: "accounts",        title: "Accounts",        desc: "Understanding your account types, balance, and statements.", icon: "🏦" },
  { slug: "transfers",       title: "Transfers",       desc: "How to send money, limits, and transaction fees.", icon: "💸" },
  { slug: "loans",           title: "Loans",           desc: "Eligibility, application process, and repayment.", icon: "💳" },
  { slug: "ai-coach",        title: "AI Coach",        desc: "How the AI coach works and what it can help with.", icon: "🤖" },
  { slug: "security",        title: "Security",        desc: "Biometrics, KYC, auto-lock, and keeping your account safe.", icon: "🔐" },
  { slug: "faq",             title: "FAQ",             desc: "Common questions answered.", icon: "❓" },
];

export default function DocsPage() {
  return (
    <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--teal-light)]">Documentation</p>
        <h1 className="font-black mb-4" style={{ fontSize: "clamp(32px,6vw,56px)", letterSpacing: "-2px" }}>Knowledge Base</h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mb-8">Everything you need to get the most out of futureBank.</p>
        <Link href="/ask"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:border-[var(--teal)] hover:text-white border border-[var(--border)] text-[var(--muted)]">
          ✨ Can't find what you need? Ask AI →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(d => (
          <Link key={d.slug} href={`/docs/${d.slug}`}
            className="rounded-3xl border border-[var(--border)] p-6 flex items-start gap-4 hover:-translate-y-1 hover:border-[var(--teal)] transition-all duration-200 group"
            style={{ background: "var(--card)" }}>
            <div className="text-3xl">{d.icon}</div>
            <div>
              <h2 className="font-bold mb-1 group-hover:text-white transition-colors">{d.title}</h2>
              <p className="text-sm text-[var(--muted)]">{d.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
