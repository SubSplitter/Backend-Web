// Users table
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }), // Optional username field
  role: varchar('role', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  paymentMethodId: varchar('payment_method_id', { length: 255 }),
});
