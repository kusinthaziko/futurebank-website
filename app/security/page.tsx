import Link from "next/link";

const sections = [
  {
    icon: "👆", title: "Biometric Authentication",
    desc: "futureBank uses your device's fingerprint sensor or Face ID to authenticate you. No passwords are stored on our servers. Even if our database were compromised, there's nothing to steal.",
    detail: "Powered by Android Keystore and iOS Secure Enclave.",
  },
  {
    icon: "🚫", title: "Screenshot Prevention",
    desc: "Sensitive screens — your balance, transaction history, KYC documents — are protected from screenshots and screen recording. Android FLAG_SECURE is applied automatically.",
    detail: "Implemented via native Android WindowManager flags.",
  },
  {
    icon: "🔑", title: "Encrypted Local Storage",
    desc: "All data stored on your device — tokens, cached balances — is encrypted using AES-256 via flutter_secure_storage, backed by Android Keystore.",
    detail: "Keys never leave the device's secure enclave.",
  },
  {
    icon: "⏱️", title: "Auto-Lock",
    desc: "The app automatically locks after 5 minutes of inactivity, requiring biometric re-authentication. You can configure the timeout in Settings.",
    detail: "Configurable: 1, 5, or 15 minutes.",
  },
  {
    icon: "🔒", title: "Secure API Communication",
    desc: "All network communication uses TLS 1.3 with certificate pinning. Even on untrusted campus WiFi, your data cannot be intercepted.",
    detail: "SHA-256 certificate pins verified on every request.",
  },
  {
    icon: "🛡️", title: "KYC Identity Verification",
    desc: "Upload your student ID for verification. Your identity is checked against institution records and stored securely — not on any blockchain.",
    detail: "Manual review by institution finance managers.",
  },
];

export default function SecurityPage() {
  return (
    <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <div className="mb-16 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>Security</p>
        <h1 className="font-black mb-4" style={{ fontSize: "clamp(36px,7vw,64px)", letterSpacing: "-2px" }}>
          Your money is safe.
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-xl mx-auto">
          We built futureBank with bank-grade security from day one. Here's exactly how.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((s, i) => (
          <div key={s.title} className="rounded-3xl border border-[var(--border)] p-8 flex gap-6 hover:border-[var(--teal)] transition-all duration-200"
            style={{ background: "var(--card)" }}>
            <div className="text-4xl shrink-0">{s.icon}</div>
            <div>
              <h2 className="text-xl font-bold mb-3">{s.title}</h2>
              <p className="text-[var(--muted)] leading-relaxed mb-3">{s.desc}</p>
              <p className="text-xs font-mono px-3 py-1.5 rounded-lg inline-block" style={{ background: "rgba(0,105,92,0.1)", color: "var(--teal-light)" }}>
                {s.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/#download"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all hover:-translate-y-1"
          style={{ background: "linear-gradient(135deg,var(--teal),var(--teal-light))", boxShadow: "0 8px 32px rgba(0,105,92,0.4)" }}>
          ⬇ Download Free
        </Link>
      </div>
    </main>
  );
}
