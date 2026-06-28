# Fino — Open-Source AI Expense Tracker via WhatsApp

Fino is a premium, open-source personal finance assistant that tracks your expenses automatically through WhatsApp. Just message Fino (e.g. `200 KFC` or `50 for petrol`), and the AI will parse, categorize, and log the transaction in your database, updating your dashboard in real-time.

---

## Key Features
*   **WhatsApp Integration**: Seamlessly link your WhatsApp account (either personal self-chat or as a dedicated bot number).
*   **AI Parsing & Categorization**: Uses Groq AI (llama-3.3-70b) to instantly extract amounts, match descriptions, and assign categories.
*   **Interactive Analytics Dashboard**: Beautiful UI built with Next.js, featuring spending breakdowns, charts, and transaction histories.
*   **Daily Spending Broadcasts**: Receive timezone-adjusted automated daily summaries directly on WhatsApp.
*   **Multi-User & Security**: Secured with Clerk authentication so each user manages their own settings and expenses privately.

---

## Architecture Diagram

```mermaid
graph TD
    Client[WhatsApp Mobile App] -->|Sends message| Bot[Baileys Bot Process :3005]
    Bot -->|Invokes parsing| Groq[Groq AI API]
    Bot -->|Saves Expense| DB[(Supabase PostgreSQL)]
    Web[Next.js Dashboard :3000] -->|Fetches Stats| Bot
    Web -->|Queries Data| DB
    Web -->|User Auth| Clerk[Clerk Auth]
```

---

## Getting Started

### 1. Prerequisites
*   Node.js (v18 or newer)
*   A running PostgreSQL database instance (e.g., Supabase)
*   A Clerk account (for user authentication)
*   A Groq Cloud API Key (for LLM parsing)

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in the required parameters:
```bash
# Database URL
DATABASE_URL="postgresql://user:pass@host:port/dbname"

# AI Configuration
WhatsApp_Chatbot_API_KEY="your_groq_api_key_here"

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 3. Setup and Run
Install dependencies:
```bash
npm install
```

Generate and apply the database schema migrations:
```bash
npm run db:generate
npm run db:migrate
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your dashboard. Link your WhatsApp number under **Settings** by scanning the displayed QR code.

---

## Production Deployment Guide

> [!IMPORTANT]
> **Deployment Server Requirements:**
> Fino runs a background node process (`bin/whatsapp-bot.ts`) to maintain a persistent connection to WhatsApp sockets and listen to incoming messages.
>
> *   **Do NOT deploy on Serverless platforms (like Vercel, Netlify, or AWS Lambda).** Serverless functions are ephemeral, terminate quickly, and cannot run background loops or persistent socket listeners.
> *   **Do deploy on Container or VPS hosts (like Railway, Render, Fly.io, Heroku, or a VPS/digitalocean droplet).** Ensure the platform supports persistent processes and stateful directory caching if you store authentication locally (or link a persistent storage volume to `./.wwebjs_auth` to keep your WhatsApp login active across restarts).

### Deployment Checklist
1. Set `NODE_ENV=production`.
2. Configure all environment keys from `.env.example`.
3. Build the Next.js bundle: `npm run build`.
4. Start the server: `npm run start`.
