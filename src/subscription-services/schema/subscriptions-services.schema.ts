// File: src/subscription-services/schema/subscriptions-services.schema.ts
import { pgTable, varchar, uuid, timestamp, text, decimal } from 'drizzle-orm/pg-core';

export const subscriptionServices = pgTable('subscription_services', {
  serviceId: uuid('service_id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  monthlyCost: decimal('monthly_cost', { precision: 10, scale: 2 }).notNull(),
  regionsAvailable: text('regions_available').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});