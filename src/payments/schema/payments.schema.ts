import { pgTable, uuid, varchar, timestamp, decimal } from 'drizzle-orm/pg-core';
import { poolMembers } from 'src/pool-members/schema/poolMembers.schems';

export const payments = pgTable('payments', {
  paymentId: uuid('payment_id').primaryKey().defaultRandom(),
  poolMemberId: uuid('pool_member_id').references(() => poolMembers.poolMemberId),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  escrowStatus: varchar('escrow_status', { length: 50 }).notNull(),
  paymentDate: timestamp('payment_date').defaultNow(),
  releaseDate: timestamp('release_date'),
});
