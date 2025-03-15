ALTER TABLE "pools" RENAME COLUMN "user_subscription_id" TO "pool_id";--> statement-breakpoint
ALTER TABLE "disputes" DROP CONSTRAINT "disputes_user_subscription_id_pools_user_subscription_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_members" DROP CONSTRAINT "pool_members_user_subscription_id_pools_user_subscription_id_fk";
--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_user_subscription_id_pools_pool_id_fk" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."pools"("pool_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_user_subscription_id_pools_pool_id_fk" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."pools"("pool_id") ON DELETE no action ON UPDATE no action;