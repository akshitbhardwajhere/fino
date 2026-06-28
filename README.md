<p align="center">
  <img src="./public/fino_banner.png" alt="Fino - Open-Source AI Expense Tracker via WhatsApp" width="100%" />
</p>

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

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
