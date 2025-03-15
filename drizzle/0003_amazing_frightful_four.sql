ALTER TABLE "subscription_services" ADD COLUMN "slug" varchar(100) ;--> statement-breakpoint
ALTER TABLE "subscription_services" ADD CONSTRAINT "subscription_services_slug_unique" UNIQUE("slug");