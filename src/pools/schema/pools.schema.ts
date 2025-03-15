// File: src/user-subscriptions/schema/user-subscriptions.schema.ts
import {
  pgTable,
  uuid,
  timestamp,
  decimal,
  integer,
  boolean,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { subscriptionServices } from 'src/subscription-services/schema/subscriptions-services.schema';
import { users } from '../../users/schema/user.schema';

export const pools = pgTable('pools', {
  poolId: uuid('pool_id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.userId),
  serviceId: uuid('service_id').references(() => subscriptionServices.serviceId),
  name: varchar('name', { length: 100 }),
  encryptedCredentials: text('encrypted_credentials'),
  slotsTotal: integer('slots_total').notNull(),
  slotsAvailable: integer('slots_available').notNull(),
  costPerSlot: decimal('cost_per_slot', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

// Re-export the subscriptionServices for joins
export { subscriptionServices } from 'src/subscription-services/schema/subscriptions-services.schema';
