import { NextRequest } from "next/server";
import { getDocsContext } from "../../lib/docs";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const suggestions = [
  "How do I register?",
  "How do transfers work?",
  "How does the AI coach help me?",
  "Is my money safe?",
  "How do I apply for a loan?",
  "What are the loan limits?",
  "How do I reset my PIN?",
  "What happens if my phone is stolen?",
];

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question?.trim()) {
    return new Response(JSON.stringify({ error: "No question" }), { status: 400 });
  }

  const knowledgeBase = getDocsContext();
  const encoder = new TextEncoder();

  const shuffle = [...suggestions].sort(() => Math.random() - 0.5);
  const followUps = shuffle.slice(0, 3);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk: string) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`)); } catch {}
      };
      const sendJson = (data: Record<string, unknown>) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); } catch {}
      };
      const close = (extra: Record<string, unknown> = {}) => {
        try {
          sendJson({ done: true, suggestions: followUps, ...extra });
          controller.close();
        } catch {}
      };

      const abortController = new AbortController();
      req.signal.addEventListener("abort", () => abortController.abort());

      if (GEMINI_KEY) {
        try {
          const prompt = `You are futureBank AI — a helpful financial assistant for African university students.

Answer the user's question using the knowledge base below. Be concise, friendly, and use plain language.

Use markdown for formatting (bold, lists, code) where helpful.

If the answer isn't in the knowledge base, say so honestly and suggest checking the docs or contacting support.

KNOWLEDGE BASE:
${knowledgeBase}

---

Question: ${question}`;

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
            {
              signal: abortController.signal,
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                safetySettings: [
                  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                ],
              }),
            }
          );

          if (!res.ok) {
            send("Sorry, I'm having trouble thinking right now. Please try again shortly.");
            close();
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            send("Sorry, I couldn't process that. Please try again.");
            close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";
          let fullText = "";

          while (true) {
            const { done: readerDone, value } = await reader.read();
            if (readerDone) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const json = JSON.parse(line.slice(6));
                  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    fullText += text;
                    send(text);
                  }
                } catch { /* skip */ }
              }
            }
          }

          close();
        } catch (err: unknown) {
          if (err instanceof Error && err.name === "AbortError") {
            send("⏸️ Stopped.");
            close({ stopped: true });
            return;
          }
          send("Sorry, I encountered an error. Please try again.");
          close();
        }
      } else {
        const q = question.toLowerCase();

        // Check if the knowledge base has relevant info
        const kbLower = knowledgeBase.toLowerCase();
        const words = q.split(/\s+/).filter((w: string) => w.length > 3);
        const hasMatch = words.some((w: string) => kbLower.includes(w));

        if (!hasMatch) {
          send("I couldn't find specific information about that in our knowledge base. Try asking about **getting started**, **accounts**, **transfers**, **loans**, **AI coach**, or **security**.");
          close();
        } else {
          const lines = knowledgeBase.split("\n");
          const preview = lines.slice(0, 20).join("\n");
          send(`Here's what I found in our docs:\n\n${preview}\n\n`);
          close();
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
