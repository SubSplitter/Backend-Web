import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { pools } from 'src/pools/schema/pools.schema';
import { users } from 'src/users/schema/user.schema';

export const disputes = pgTable('disputes', {
    disputeId: uuid('dispute_id').primaryKey().defaultRandom(),
    reporterUserId: uuid('reporter_user_id').references(() => users.userId),
    reportedUserId: uuid('reported_user_id').references(() => users.userId),
    poolId: uuid('pool_id').references(() => pools.poolId),
    description: text('description').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    resolvedAt: timestamp('resolved_at'),
  });