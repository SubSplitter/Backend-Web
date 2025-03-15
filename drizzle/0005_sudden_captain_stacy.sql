ALTER TABLE "subscription_services" ADD COLUMN "category" varchar(50);--> statement-breakpoint
ALTER TABLE "subscription_services" DROP COLUMN "monthly_cost";