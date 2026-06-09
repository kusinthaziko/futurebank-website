import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "futureBank — Campus Financial Super-App",
  description: "Savings, transfers, micro-loans, and AI-powered financial coaching for African university students.",
  openGraph: {
    title: "futureBank",
    description: "Campus financial super-app built for African students.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
