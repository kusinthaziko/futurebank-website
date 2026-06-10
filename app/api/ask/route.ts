import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://futurebank-api.onrender.com";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question?.trim()) return NextResponse.json({ error: "No question" }, { status: 400 });

  try {
    const res = await fetch(`${BACKEND}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    return NextResponse.json({ answer: data.answer });
  } catch {
    return NextResponse.json({ answer: "I'm having trouble connecting right now. Please try again shortly." });
  }
}
