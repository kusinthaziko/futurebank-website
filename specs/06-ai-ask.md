# AI Ask Feature Spec

## Purpose
Let visitors ask any question about futureBank and get an instant answer.
Reduces support load. Builds trust. Shows the product is AI-powered.

## Page: /ask

### UI
- Full-height chat interface
- Dark background (var(--navy))
- Message bubbles: user = right (blue), AI = left (dark card)
- Typing indicator (3 animated dots) while streaming
- Input: fixed bottom, pill shape, send button
- Suggested questions shown before first message

### Suggested Questions
- "How do I register for futureBank?"
- "How do transfers work?"
- "What is the AI financial coach?"
- "How does the health score work?"
- "Is my money safe?"
- "How do I apply for a loan?"

## API: POST /api/ask

### Request
```json
{ "question": "How do I register?" }
```

### Response
Streamed text (Vercel AI SDK streaming)

### Implementation
- Next.js route handler: `app/api/ask/route.ts`
- Calls `NEXT_PUBLIC_API_URL/api/ask` on the Elixir backend
- Backend uses Gemini with system prompt containing all docs content
- Falls back to Cerebras if Gemini quota hit

### System Prompt Context
- All /content/docs/*.md files concatenated
- App description and features summary
- "You are the futureBank AI assistant. Answer only questions about futureBank."

## Backend Endpoint (Elixir)
- Route: POST /api/ask
- No auth required (public)
- Rate limit: 20 requests/minute per IP
- Uses existing Gemini keys from env
