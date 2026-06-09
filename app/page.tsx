"use client";
import dynamic from "next/dynamic";
import DownloadButtons from "./components/DownloadButtons";

const PhoneCanvas = dynamic(() => import("./components/PhoneCanvas"), { ssr: false });

const features = [
  { icon: "🤖", title: "AI Financial Coach", desc: "Personalised spending insights, savings tips, and loan guidance powered by AI that understands student life.", wide: true, color: "rgba(26,86,219,0.15)" },
  { icon: "💸", title: "Instant Transfers", desc: "Send money to any student on campus in seconds.", wide: false, color: "rgba(13,155,100,0.15)" },
  { icon: "📈", title: "Health Score", desc: "Real-time financial health score with personalised recommendations.", wide: false, color: "rgba(212,160,23,0.15)" },
  { icon: "🏆", title: "Savings Challenges", desc: "Compete with friends on savings goals and climb the leaderboard.", wide: false, color: "rgba(124,58,237,0.15)" },
  { icon: "🔐", title: "Bank-Grade Security", desc: "Biometric login, certificate pinning, auto-lock, screenshot prevention, and blockchain-verified identity.", wide: true, color: "rgba(220,38,38,0.15)" },
  { icon: "💳", title: "Micro-Loans", desc: "Apply for campus loans in minutes with instant eligibility checks.", wide: false, color: "rgba(26,86,219,0.15)" },
];

const founders = [
  { name: "Timothy Chalira", role: "Founder & CEO", bio: "Driving the vision of accessible campus finance across Africa.", handle: "TimothyChalira" },
  { name: "Redson Ngwira", role: "Co-Founder & CTO", bio: "Full-stack engineer building the product end to end.", handle: "RedsoNNgwira" },
];

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(6,13,26,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,58,95,0.5)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xl text-white"
            style={{ background: "linear-gradient(135deg, #0D2F6E, #1A56DB)" }}>f</div>
          <span className="font-bold text-lg text-white">futureBank</span>
        </div>
        <a href="#download"
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-80"
          style={{ background: "#1A56DB" }}>
          Download
        </a>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 px-6 pt-24 pb-16 relative overflow-hidden max-w-7xl mx-auto">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none glow-pulse"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(26,86,219,0.12) 0%, transparent 60%)" }} />

        {/* Text */}
        <div className="flex-1 text-center lg:text-left z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017" }}>
            🇲🇼 Built for African students
          </span>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight mb-5 fade-up">
            Your campus.<br />
            <span style={{ background: "linear-gradient(135deg, #4D7FE8, #D4A017)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Your bank.
            </span>
          </h1>
          <p className="text-lg lg:text-xl mb-8 leading-relaxed max-w-xl fade-up fade-up-delay-1" style={{ color: "#8BA5D4" }}>
            Savings, transfers, micro-loans, and AI-powered financial coaching —
            all in one app built for university students in Africa.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start fade-up fade-up-delay-2">
            <a href="#download"
              className="px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #1A56DB, #4D7FE8)", boxShadow: "0 8px 32px rgba(26,86,219,0.4)" }}>
              ⬇ Download Free
            </a>
            <a href="#features"
              className="px-8 py-4 rounded-full text-base font-semibold transition-all hover:border-blue-500"
              style={{ border: "1px solid #1E3A5F", color: "#8BA5D4" }}>
              See Features
            </a>
          </div>
        </div>

        {/* 3D Phone */}
        <div className="flex-1 w-full lg:w-auto h-[500px] lg:h-[600px] fade-up fade-up-delay-3">
          <PhoneCanvas />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto" id="features">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4D7FE8" }}>Features</p>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-12">
          Everything students need<br />to manage money
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title}
              className={`rounded-3xl p-7 border transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 ${f.wide ? "md:col-span-2" : ""}`}
              style={{ background: "#0D1B30", borderColor: "#1E3A5F" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8BA5D4" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="py-20 px-6 max-w-6xl mx-auto" id="team">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4D7FE8" }}>The Team</p>
        <h2 className="text-4xl font-black tracking-tight mb-12">Built by students,<br />for students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {founders.map((f) => (
            <div key={f.name} className="rounded-3xl p-7 border flex items-start gap-5" style={{ background: "#0D1B30", borderColor: "#1E3A5F" }}>
              <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-black"
                style={{ background: "rgba(26,86,219,0.2)", color: "#4D7FE8" }}>
                {f.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{f.name}</div>
                <div className="text-sm mb-2" style={{ color: "#4D7FE8" }}>{f.role}</div>
                <div className="text-sm mb-4" style={{ color: "#8BA5D4" }}>{f.bio}</div>
                <a href={`https://x.com/${f.handle}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:opacity-80"
                  style={{ background: "rgba(29,161,242,0.1)", color: "#1DA1F2", border: "1px solid rgba(29,161,242,0.2)" }}>
                  𝕏 @{f.handle}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="py-20 px-6 text-center" id="download"
        style={{ background: "linear-gradient(180deg, transparent, rgba(26,86,219,0.05))" }}>
        <div className="max-w-lg mx-auto rounded-3xl p-12 border" style={{ background: "#0D1B30", borderColor: "#1E3A5F" }}>
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-3xl font-black mb-2">Download futureBank</h2>
          <p className="text-sm mb-8" style={{ color: "#8BA5D4" }}>Free for Android. No credit card required.</p>
          <DownloadButtons />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 text-center text-sm border-t" style={{ borderColor: "#1E3A5F", color: "#4D6B9A" }}>
        Made with ❤️ in Malawi 🇲🇼 &nbsp;·&nbsp; © 2026 futureBank &nbsp;·&nbsp;
        <a href="mailto:support@futurebank.app" className="hover:text-blue-400 transition-colors">Support</a>
      </footer>
    </main>
  );
}
