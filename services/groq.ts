import Groq from "groq-sdk";
import { logger } from "@/utils/logger";

// Retrieve Groq API key from environment
const apiKey = process.env.WhatsApp_Chatbot_API_KEY || process.env.GROQ_API_KEY;

if (!apiKey) {
  logger.warn(
    "Groq API Key (WhatsApp_Chatbot_API_KEY or GROQ_API_KEY) is missing in environment variables.",
  );
}

const groq = new Groq({
  apiKey: apiKey || "",
});

export interface ParsedExpense {
  amount: number;
  category:
    "Food" | "Transport" | "Utilities" | "Travel" | "Entertainment" | "Other";
  description: string;
}

export interface ParsedMessage {
  intent: "track_expense" | "other";
  expense: ParsedExpense | null;
  reply: string;
}

export class GroqService {
  /**
   * Parses the incoming text message to detect intent and extract structured data
   */
  public static async parseMessage(text: string, currencySymbol: string = '₹'): Promise<ParsedMessage> {
    if (!apiKey) {
      logger.error(
        "Cannot parse message with Groq: API key is not configured.",
      );
      return {
        intent: "other",
        expense: null,
        reply:
          "⚠️ AI Parser Configuration Error: Groq API key is not set on the server.",
      };
    }

    try {
      logger.info(`Sending message to Groq for parsing: "${text}"`);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are Fino, a personal WhatsApp automation assistant. Your job is to classify the intent of user messages and extract structured data.
Currently, your primary module is an Expense Tracker.
Valid categories: Food, Transport, Utilities, Travel, Entertainment, Other.

You must respond ONLY with a JSON object. The JSON object must match this schema:
{
  "intent": "track_expense" | "other",
  "expense": {
    "amount": number,
    "category": "Food" | "Transport" | "Utilities" | "Travel" | "Entertainment" | "Other",
    "description": "Short description of what the expense was for"
  } | null,
  "reply": "Sleek WhatsApp markdown message. If intent is 'track_expense', it MUST follow this structure: '💸 *Expense Tracked!*\\n-------------------------\\n💰 *Amount:* ${currencySymbol}<amount_formatted_to_two_decimals>\\n🏷️ *Category:* <category_name> <category_emoji>\\n📝 *Description:* _<description>_\\n-------------------------\\n💡 _View your updated spending on your dashboard!_'. If intent is 'other', it MUST follow this structure: '👋 *Hi, I\\'m Fino!*\\nYour personal finance assistant on WhatsApp.\\n\\nTo track an expense, just text me like this:\\n👉 \`150 for lunch\`\\n👉 \`300 petrol\`\\n👉 \`2500 flight ticket\`\\n\\n📊 _Check your dashboard anytime to view your analytics!_'"
}

Rules for formatting the "reply" string:
1. If intent is "track_expense", format the reply strictly using this layout (using appropriate emojis for the category):
💸 *Expense Tracked!*
-------------------------
💰 *Amount:* ${currencySymbol}<amount_formatted_to_two_decimals>
🏷️ *Category:* <category_name> <matching_category_emoji>
📝 *Description:* _<description>_
-------------------------
💡 _View your updated spending on your dashboard!_

2. If intent is "other", reply with a friendly welcome message showing how to use Fino:
👋 *Hi, I'm Fino!*
Your personal finance assistant on WhatsApp.

To track an expense, just text me like this:
👉 \`150 for lunch\`
👉 \`300 petrol\`
👉 \`2500 flight ticket\`

📊 _Check your dashboard anytime to view your analytics!_

Rules for parsing:
- If the user specifies an expense (e.g., "10 for chips", "2500 for gurez trip", "300 petrol"), set intent to "track_expense", extract the numerical amount, assign a matching category, extract the description, and write a confirmation reply.
- If the user sends a greeting or general text not related to an expense, set intent to "other", set expense to null, and write the greeting reply.
- Do not add any text before or after the JSON output.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("Groq returned an empty response.");
      }

      logger.info(`Groq response received: ${responseText}`);
      const parsed: ParsedMessage = JSON.parse(responseText);

      return parsed;
    } catch (error) {
      logger.error(error, "Error parsing message with Groq AI");
      return {
        intent: "other",
        expense: null,
        reply:
          "🤖 Sorry, I encountered an issue analyzing your message. Please try again.",
      };
    }
  }

  /**
   * Generates a friendly daily summary message using Groq AI
   */
  public static async generateDailySummary(
    expensesList: Array<{
      amount: string;
      category: string;
      description: string | null;
    }>,
    currency: string,
  ): Promise<string> {
    if (!apiKey) {
      logger.error(
        "Cannot generate daily summary with Groq: API key is not configured.",
      );
      return "⚠️ AI Summary Configuration Error: Groq API key is not set on the server.";
    }

    try {
      logger.info(
        `Sending ${expensesList.length} expenses to Groq for daily summary generation`,
      );

      const totalAmount = expensesList.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0,
      );

      const expensesFormatted = expensesList
        .map(
          (item) =>
            `- ${currency.split(" ")[0]} ${parseFloat(item.amount).toFixed(2)} on "${
              item.description || "Unspecified"
            }" [Category: ${item.category}]`,
        )
        .join("\n");

      const promptContent = `Here is the list of expenses recorded today (total: ${currency.split(" ")[0]} ${totalAmount.toFixed(2)}):
${expensesFormatted || "No expenses recorded today."}

Please draft a sleek, beautifully formatted summary broadcast using the formatting rules. Format the currency using ${currency.split(" ")[0]}. Do not wrap the response in markdown code blocks, output only the raw message ready for copy-pasting.`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are Fino, a personal finance WhatsApp bot. Your job is to draft a sleek, beautiful, and encouraging daily spending summary message for the user based on their tracked expenses.
Your response MUST use WhatsApp markdown formatting:
- Use *bold* for emphasis, keys, amounts, and headers.
- Use _italic_ for descriptions, dates, or notes.
- Use emojis generously to make the message visually engaging (e.g. 📊, 💰, 💸, 📅, 🍔, 🚗, 💡, 🌟).
- Put short horizontal divider lines (e.g. -------------------------) to separate sections.
- Keep it highly structured, airy, and easy to read at a single glance.

Structuring guidelines:
1. Title block: "📊 *FINO DAILY SUMMARY*" with today's date.
2. Total amount spent highlighted in bold.
3. Breakdown of expenses grouped by Category with appropriate category emojis.
4. Provide a quick encouraging feedback or personal insight.
5. End with a friendly, brief closing remark.`,
          },
          {
            role: "user",
            content: promptContent,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("Groq returned an empty response for daily summary.");
      }

      return responseText.trim();
    } catch (error) {
      logger.error(error, "Error generating daily summary with Groq AI");
      const totalAmount = expensesList.reduce(
        (sum, item) => sum + parseFloat(item.amount),
        0,
      );
      const todayStr = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return `📊 *FINO DAILY SUMMARY*\n📅 _Date: ${todayStr}_\n\n-------------------------\n\n💰 *Total Spent Today:* *${currency.split(" ")[0]} ${totalAmount.toFixed(2)}*\n\n(Fallback summary triggered due to AI error. Please check server logs.)`;
    }
  }
}
