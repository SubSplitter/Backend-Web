// Pool Members table
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { userSubscriptions } from 'src/user-subscriptions/schema/user-subscription.schema';
import { users } from 'src/users/schema/user.schema';

export const poolMembers = pgTable('pool_members', {
  poolMemberId: uuid('pool_member_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.userId),
  userSubscriptionId: uuid('user_subscription_id').references(
    () => userSubscriptions.userSubscriptionId,
  ),
  joinedAt: timestamp('joined_at').defaultNow(),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull(),
  accessStatus: varchar('access_status', { length: 50 }).notNull(),
  lastPaymentDate: timestamp('last_payment_date'),
});


// Re-export for joins
export { userSubscriptions } from '../../user-subscriptions/schema/user-subscription.schema';
export { subscriptionServices } from '../../subscription-services/schema/subscriptions-services.schema';