import Groq from 'groq-sdk';
import { logger } from '@/utils/logger';

// Retrieve Groq API key from environment
const apiKey = process.env.WhatsApp_Chatbot_API_KEY || process.env.GROQ_API_KEY;

if (!apiKey) {
  logger.warn('Groq API Key (WhatsApp_Chatbot_API_KEY or GROQ_API_KEY) is missing in environment variables.');
}

const groq = new Groq({
  apiKey: apiKey || '',
});

export interface ParsedExpense {
  amount: number;
  category: 'Food' | 'Transport' | 'Utilities' | 'Travel' | 'Entertainment' | 'Other';
  description: string;
}

export interface ParsedMessage {
  intent: 'track_expense' | 'other';
  expense: ParsedExpense | null;
  reply: string;
}

export class GroqService {
  /**
   * Parses the incoming text message to detect intent and extract structured data
   */
  public static async parseMessage(text: string): Promise<ParsedMessage> {
    if (!apiKey) {
      logger.error('Cannot parse message with Groq: API key is not configured.');
      return {
        intent: 'other',
        expense: null,
        reply: '⚠️ AI Parser Configuration Error: Groq API key is not set on the server.',
      };
    }

    try {
      logger.info(`Sending message to Groq for parsing: "${text}"`);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
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
  "reply": "A friendly, short confirmation message. For expenses, summarize what was tracked (e.g., '₹10 for chips tracked under Food!'). For non-expenses, gently guide the user on how to track expenses."
}

Rules for parsing:
- If the user specifies an expense (e.g., "10 for chips", "2500 for gurez trip", "300 petrol"), set intent to "track_expense", extract the numerical amount, assign a matching category, extract the description, and write a confirmation reply.
- If the user sends a greeting or general text not related to an expense, set intent to "other", set expense to null, and write a friendly reply explaining how they can use you to track expenses.
- Do not add any text before or after the JSON output.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('Groq returned an empty response.');
      }

      logger.info(`Groq response received: ${responseText}`);
      const parsed: ParsedMessage = JSON.parse(responseText);

      return parsed;
    } catch (error) {
      logger.error(error, 'Error parsing message with Groq AI');
      return {
        intent: 'other',
        expense: null,
        reply: '🤖 Sorry, I encountered an issue analyzing your message. Please try again.',
      };
    }
  }
}
