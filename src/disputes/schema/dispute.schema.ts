import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { userSubscriptions } from 'src/user-subscriptions/schema/user-subscription.schema';
import { users } from 'src/users/schema/user.schema';

export const disputes = pgTable('disputes', {
    disputeId: uuid('dispute_id').primaryKey().defaultRandom(),
    reporterUserId: uuid('reporter_user_id').references(() => users.userId),
    reportedUserId: uuid('reported_user_id').references(() => users.userId),
    userSubscriptionId: uuid('user_subscription_id').references(() => userSubscriptions.userSubscriptionId),
    description: text('description').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    resolvedAt: timestamp('resolved_at'),
  });