ALTER TABLE "subscription_services" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription_services" ADD COLUMN "logo_url" varchar(255);--> statement-breakpoint
ALTER TABLE "subscription_services" ADD COLUMN "color" varchar(7);--> statement-breakpoint
ALTER TABLE "subscription_services" ADD COLUMN "featured_position" varchar(3);