CREATE TABLE "settings" (
	"id" varchar(50) PRIMARY KEY DEFAULT 'global' NOT NULL,
	"ai_provider" varchar(50) DEFAULT 'gemini' NOT NULL,
	"timezone" varchar(100) DEFAULT 'Asia/Kolkata' NOT NULL,
	"currency" varchar(50) DEFAULT 'INR (₹)' NOT NULL,
	"summary_time" varchar(5) DEFAULT '23:00' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
