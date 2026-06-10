import { NextRequest } from "next/server";
import { getDocsContext, getAllDocs } from "../../lib/docs";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const docs = getAllDocs();

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

  // Pick 3 random follow-up suggestions
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

      // Abort when client disconnects
      const abortController = new AbortController();
      req.signal.addEventListener("abort", () => abortController.abort());

      if (GEMINI_KEY) {
        try {
          const docLabels = docs.map(d => d.title).join(", ");

          const prompt = `You are futureBank AI — a helpful financial assistant for African university students.

Answer the user's question based ONLY on the knowledge base below.

When you use information from a specific document, cite it inline with the document name in brackets like [Accounts] or [Security].

Available documents: ${docLabels}

KNOWLEDGE BASE:
${knowledgeBase}

Rules:
- Be concise and friendly
- Use markdown for formatting (bold, lists, code)
- If the answer isn't in the knowledge base, say so honestly and suggest checking the docs or contacting support
- Always cite sources when you reference specific information

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

          // Detect cited sources by document name
          const citedSources = docs.filter(d =>
            fullText.includes(`[${d.title}]`)
          );

          close({
            confidence: fullText.includes("I couldn't find") || fullText.includes("not in the knowledge base") ? "low" : "high",
            sources: citedSources.map(s => ({ title: s.title, slug: s.slug })),
          });
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
        // No API key — keyword-based search
        const q = question.toLowerCase();
        const matchedDocs = docs.filter(d => {
          const lower = d.content.toLowerCase();
          const words = q.split(/\s+/).filter((w: string) => w.length > 3);
          return words.some((w: string) => lower.includes(w));
        });

        if (matchedDocs.length === 0) {
          send("I couldn't find specific information about that in our knowledge base. Try asking about **getting started**, **accounts**, **transfers**, **loans**, **AI coach**, or **security**.");
          close({ confidence: "low", sources: [] });
        } else {
          for (const doc of matchedDocs.slice(0, 2)) {
            const body = doc.content.split("\n").slice(1).join("\n").trim();
            const preview = body.split("\n").slice(0, 8).join("\n");
            send(`**${doc.title}**\n\n${preview}\n\n`);
            await new Promise(r => setTimeout(r, 20));
          }
          close({
            confidence: "medium",
            sources: matchedDocs.slice(0, 2).map(s => ({ title: s.title, slug: s.slug })),
          });
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
