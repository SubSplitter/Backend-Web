ALTER TABLE "user_subscriptions" RENAME TO "pools";--> statement-breakpoint
ALTER TABLE "disputes" DROP CONSTRAINT "disputes_user_subscription_id_user_subscriptions_user_subscription_id_fk";
--> statement-breakpoint
ALTER TABLE "pool_members" DROP CONSTRAINT "pool_members_user_subscription_id_user_subscriptions_user_subscription_id_fk";
--> statement-breakpoint
ALTER TABLE "pools" DROP CONSTRAINT "user_subscriptions_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "pools" DROP CONSTRAINT "user_subscriptions_service_id_subscription_services_service_id_fk";
--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_user_subscription_id_pools_user_subscription_id_fk" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."pools"("user_subscription_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_user_subscription_id_pools_user_subscription_id_fk" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."pools"("user_subscription_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pools" ADD CONSTRAINT "pools_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pools" ADD CONSTRAINT "pools_service_id_subscription_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."subscription_services"("service_id") ON DELETE no action ON UPDATE no action;