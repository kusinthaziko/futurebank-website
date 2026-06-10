const universities = [
  "University of Malawi", "MZUNI", "Lilongwe University", "Polytechnic",
  "LUANAR", "DMI St John", "Malawi College of Health Sciences", "MUST",
  "Catholic University", "University of Malawi", "MZUNI", "Lilongwe University",
];

export default function SocialProof() {
  const doubled = [...universities, ...universities];
  return (
    <div className="py-6 overflow-hidden border-y" style={{ borderColor: "var(--border)" }}>
      <div className="flex gap-12 whitespace-nowrap animate-ticker" style={{ width: "max-content" }}>
        {doubled.map((u, i) => (
          <span key={i} className="text-sm font-medium flex items-center gap-3" style={{ color: "var(--subtle)" }}>
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: "var(--blue)" }} />
            {u}
          </span>
        ))}
      </div>
    </div>
  );
}
