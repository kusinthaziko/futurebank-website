import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/ui/Nav";
import Footer from "./components/ui/Footer";
import BottomBar from "./components/ui/BottomBar";

export const metadata: Metadata = {
  title: "futureBank — Campus Financial Super-App",
  description: "Savings, transfers, micro-loans, and AI-powered financial coaching for African university students.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "futureBank — Campus Financial Super-App",
    description: "The financial super-app built for African university students.",
    type: "website",
    url: "https://getfuturebank.vercel.app",
    images: [{ url: "/icon.png", width: 1024, height: 1024 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Footer />
        <BottomBar />
      </body>
    </html>
  );
}
