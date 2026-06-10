import Link from "next/link";

const features = [
  { icon: "💸", title: "Instant Transfers", desc: "Send money to any student on campus in seconds. Real-time balance updates, transaction history, and receipts.", category: "Banking" },
  { icon: "💰", title: "Savings Accounts", desc: "Open a savings account, set goals, and track progress with visual insights.", category: "Banking" },
  { icon: "📈", title: "Financial Health Score", desc: "A real-time score from 0-1000 based on your spending, savings, and loan history. Personalised recommendations to improve it.", category: "Intelligence" },
  { icon: "🤖", title: "AI Financial Coach", desc: "Ask anything about your finances. The AI analyses your transactions and gives personalised, actionable advice.", category: "Intelligence" },
  { icon: "💳", title: "Micro-Loans", desc: "Apply for campus loans in minutes. Eligibility check, instant decision, and repayment schedule — all in the app.", category: "Credit" },
  { icon: "🏆", title: "Savings Challenges", desc: "Join savings challenges with friends. Compete on leaderboards and earn badges for hitting your goals.", category: "Social" },
  { icon: "👥", title: "Social Groups", desc: "Create financial groups with classmates. Pool savings, split bills, and track group spending.", category: "Social" },
  { icon: "🧾", title: "Digital Receipts", desc: "PDF receipts for every transaction. Download and share proof of payment instantly.", category: "Banking" },
  { icon: "🔐", title: "Biometric Login", desc: "Fingerprint and face unlock. No passwords to remember, no security compromises.", category: "Security" },
  { icon: "🚫", title: "Screenshot Protection", desc: "Sensitive screens protected from capture. Your balance and KYC data stays private.", category: "Security" },
];

const categories = [...new Set(features.map(f => f.category))];

export default function FeaturesPage() {
  return (
    <main className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-16">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-[var(--teal-light)]">Features</p>
        <h1 className="font-black mb-4" style={{ fontSize: "clamp(36px,7vw,64px)", letterSpacing: "-2px" }}>
          Everything in one app.
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-xl">
          No more juggling multiple apps for banking, loans, and financial advice.
        </p>
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--gold)]">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.filter(f => f.category === cat).map(f => (
              <div key={f.title} className="rounded-3xl border border-[var(--border)] p-7 hover:-translate-y-1 hover:border-[var(--teal)] transition-all duration-200"
                style={{ background: "var(--card)" }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-8">
        <Link href="/#download"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all hover:-translate-y-1"
          style={{ background: "linear-gradient(135deg,var(--teal),var(--teal-light))", boxShadow: "0 8px 32px rgba(0,105,92,0.4)" }}>
          ⬇ Download Free
        </Link>
      </div>
    </main>
  );
}
