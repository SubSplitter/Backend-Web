CREATE TABLE "disputes" (
	"dispute_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_user_id" uuid,
	"reported_user_id" uuid,
	"user_subscription_id" uuid,
	"description" text NOT NULL,
	"status" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pool_member_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"escrow_status" varchar(50) NOT NULL,
	"payment_date" timestamp DEFAULT now(),
	"release_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "pool_members" (
	"pool_member_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_subscription_id" uuid,
	"joined_at" timestamp DEFAULT now(),
	"payment_status" varchar(50) NOT NULL,
	"access_status" varchar(50) NOT NULL,
	"last_payment_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscription_services" (
	"service_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"monthly_cost" numeric(10, 2) NOT NULL,
	"regions_available" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"user_subscription_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"service_id" uuid,
	"encrypted_credentials" text,
	"slots_total" integer NOT NULL,
	"slots_available" integer NOT NULL,
	"cost_per_slot" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100),
	"role" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"payment_method_id" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_reporter_user_id_users_user_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_reported_user_id_users_user_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_user_subscription_id_user_subscriptions_user_subscription_id_fk" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."user_subscriptions"("user_subscription_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_pool_member_id_pool_members_pool_member_id_fk" FOREIGN KEY ("pool_member_id") REFERENCES "public"."pool_members"("pool_member_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pool_members" ADD CONSTRAINT "pool_members_user_subscription_id_user_subscriptions_user_subscription_id_fk" FOREIGN KEY ("user_subscription_id") REFERENCES "public"."user_subscriptions"("user_subscription_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_service_id_subscription_services_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."subscription_services"("service_id") ON DELETE no action ON UPDATE no action;