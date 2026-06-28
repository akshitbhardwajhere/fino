CREATE INDEX "daily_summaries_user_id_idx" ON "daily_summaries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "daily_summaries_user_id_date_idx" ON "daily_summaries" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "expenses_user_id_idx" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expenses_user_id_spent_at_idx" ON "expenses" USING btree ("user_id","spent_at");--> statement-breakpoint
CREATE INDEX "message_logs_user_id_idx" ON "message_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_logs_user_id_created_at_idx" ON "message_logs" USING btree ("user_id","created_at");