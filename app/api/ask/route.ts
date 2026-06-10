import { NextRequest } from "next/server";
import { getDocsContext } from "../../lib/docs";

const GEMINI_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question?.trim()) {
    return new Response(JSON.stringify({ error: "No question" }), { status: 400 });
  }

  const knowledgeBase = getDocsContext();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(chunk: string) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
      }

      function done(extra: Record<string, unknown> = {}) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, ...extra })}\n\n`));
        controller.close();
      }

      if (GEMINI_KEY) {
        try {
          const prompt = `You are futureBank AI — a helpful financial assistant for African university students.

Answer the user's question based ONLY on the knowledge base below. If the answer isn't in the knowledge base, say so politely and suggest they check the docs or contact support.

Keep answers concise, friendly, and practical. Use markdown for formatting (bold, lists, code).

KNOWLEDGE BASE:
${knowledgeBase}

---

Question: ${question}`;

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_KEY}`,
            {
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
            done();
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            send("Sorry, I couldn't process that. Please try again.");
            done();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";

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
                  if (text) send(text);
                } catch { /* skip malformed */ }
              }
            }
          }

          done();
        } catch {
          send("Sorry, I encountered an error. Please try again.");
          done();
        }
      } else {
        // No API key — do keyword-based search over knowledge base
        const q = question.toLowerCase();
        const sections = knowledgeBase.split("\n## ");
        const relevant = sections.filter(s => {
          const lower = s.toLowerCase();
          const words = q.split(/\s+/).filter((w: string) => w.length > 3);
          return words.some((w: string) => lower.includes(w));
        });

        if (relevant.length === 0) {
          send("I couldn't find specific information about that in our knowledge base. Try asking about **getting started**, **accounts**, **transfers**, **loans**, **AI coach**, or **security**.");
        } else {
          const answer = relevant.slice(0, 2).join("\n\n---\n\n");
          const lines = answer.split("\n").filter(l => l.trim());
          for (const line of lines) {
            send(line + "\n");
            await new Promise(r => setTimeout(r, 30));
          }
        }
        done({ mode: "knowledge_base" });
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
