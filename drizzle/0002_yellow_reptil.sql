ALTER TABLE "settings" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "daily_summaries" ADD COLUMN "user_id" varchar(256);--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "user_id" varchar(256);--> statement-breakpoint
ALTER TABLE "message_logs" ADD COLUMN "user_id" varchar(256);--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "whatsapp_jid" varchar(256);