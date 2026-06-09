"use client";
import { useEffect, useState } from "react";

const BASE = "https://github.com/kusinthaziko/futurebank-mobile/releases/latest/download";
const APKS = {
  arm64: `${BASE}/app-arm64-v8a-release.apk`,
  armv7: `${BASE}/app-armeabi-v7a-release.apk`,
  x86:   `${BASE}/app-x86_64-release.apk`,
};

export default function DownloadButtons() {
  const [detected, setDetected] = useState<"arm64" | "armv7" | "x86">("arm64");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/armv7|arm;/i.test(ua)) setDetected("armv7");
    else if (/x86_64/i.test(ua)) setDetected("x86");
    else setDetected("arm64");
  }, []);

  const options = [
    { key: "arm64" as const, name: "arm64-v8a", desc: "Modern phones (2017+)" },
    { key: "armv7" as const, name: "armeabi-v7a", desc: "Older 32-bit phones" },
    { key: "x86"   as const, name: "x86_64",      desc: "Emulators / Chromebooks" },
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {options.map(({ key, name, desc }) => (
        <a
          key={key}
          href={APKS[key]}
          className="flex items-center justify-between rounded-2xl px-5 py-4 border transition-all duration-200 hover:-translate-y-1"
          style={{
            background: detected === key ? "rgba(26,86,219,0.1)" : "rgba(18,32,64,0.8)",
            borderColor: detected === key ? "#1A56DB" : "#1E3A5F",
          }}
        >
          <div>
            <div className="font-semibold text-sm text-white">{name}</div>
            <div className="text-xs mt-0.5" style={{ color: "#8BA5D4" }}>{desc}</div>
          </div>
          {detected === key ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(212,160,23,0.15)", color: "#D4A017" }}>
              ✓ Best for you
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(26,86,219,0.15)", color: "#4D7FE8" }}>
              ↓ APK
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
