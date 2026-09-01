import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core'

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  plan: text('plan').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency', { enum: ['TWD', 'USD'] }).notNull(),
  cycle: text('cycle', { enum: ['Monthly', 'Yearly'] }).notNull(),
  category: text('category'),
  paymentMethod: text('payment_method').notNull(),
  renewal: text('renewal', { enum: ['Automatic', 'Manual'] }).notNull(),
  startDate: text('start_date').notNull(),
  nextPayment: text('next_payment').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
  paymentMethod: text('payment_method').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[] | null>(),
  receipt: text('receipt'),
  subscriptionId: text('subscription_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
