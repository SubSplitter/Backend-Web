// Pool Members table
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { pools } from 'src/pools/schema/pools.schema';
import { users } from 'src/users/schema/user.schema';

export const poolMembers = pgTable('pool_members', {
  poolMemberId: uuid('pool_member_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.userId),
  userSubscriptionId: uuid('pool_id').references(
    () => pools.poolId,
  ),
  joinedAt: timestamp('joined_at').defaultNow(),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull(),
  accessStatus: varchar('access_status', { length: 50 }).notNull(),
  lastPaymentDate: timestamp('last_payment_date'),
});


// Re-export for joins
export { userSubscriptions } from '../../pools/schema/pools.schema';
export { subscriptionServices } from '../../subscription-services/schema/subscriptions-services.schema';