ALTER TABLE "disputes" RENAME COLUMN "user_subscription_id" TO "pool_id";--> statement-breakpoint
ALTER TABLE "pool_members" RENAME COLUMN "user_subscription_id" TO "pool_id";--> statement-breakpoint
ALTER TABLE "disputes" DROP CONSTRAINT "disputes_user_subscription_id_pools_pool_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_members" DROP CONSTRAINT "pool_members_user_subscription_id_pools_pool_id_fk";
--> statement-breakpoint
ALTER TABLE "subscription_services" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription_services" ALTER COLUMN "logo_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription_services" ALTER COLUMN "category" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pools" ADD COLUMN "name" varchar(100);--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_pool_id_pools_pool_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("pool_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_pool_id_pools_pool_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("pool_id") ON DELETE no action ON UPDATE no action;