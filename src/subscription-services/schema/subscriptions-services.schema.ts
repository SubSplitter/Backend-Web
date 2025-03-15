// File: src/subscription-services/schema/subscriptions-services.schema.ts
import { pgTable, varchar, uuid, timestamp, text, decimal } from 'drizzle-orm/pg-core';

export const subscriptionServices = pgTable('subscription_services', {
  serviceId: uuid('service_id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique(),
  logoUrl: varchar('logo_url', { length: 255 }),
  description: text('description'),
  color: varchar('color', { length: 7 }), // Hex color code
  category: varchar('category', { length: 50 }),
  regionsAvailable: text('regions_available').array(),
  featuredPosition: varchar('featured_position', { length: 3 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
