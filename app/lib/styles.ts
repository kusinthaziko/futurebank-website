// Shared inline style constants — used instead of custom CSS classes
// This ensures styles work regardless of Tailwind purging

export const card = {
  background: "#122040",
  border: "1px solid #1E3A5F",
  borderRadius: "24px",
  transition: "border-color 0.2s, transform 0.2s",
} as React.CSSProperties;

export const cardHover = {
  borderColor: "#00695C",
  transform: "translateY(-4px)",
} as React.CSSProperties;

export const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "14px 28px",
  borderRadius: "50px",
  fontSize: "15px",
  fontWeight: 700,
  color: "white",
  background: "linear-gradient(135deg, #00695C, #4DB6AC)",
  boxShadow: "0 8px 32px rgba(0,105,92,0.35)",
  textDecoration: "none",
  cursor: "pointer",
  border: "none",
} as React.CSSProperties;

export const btnGhost = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "14px 28px",
  borderRadius: "50px",
  fontSize: "15px",
  fontWeight: 600,
  color: "#8BA5D4",
  border: "1px solid #1E3A5F",
  background: "transparent",
  textDecoration: "none",
  cursor: "pointer",
} as React.CSSProperties;

export const sectionLabel = {
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  marginBottom: "12px",
  color: "#4DB6AC",
};

export const sectionTitle = {
  fontWeight: 800,
  letterSpacing: "-1px",
  lineHeight: 1.15,
  marginBottom: "48px",
} as React.CSSProperties;
