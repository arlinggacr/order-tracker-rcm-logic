import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const orderStatus = pgEnum('order_status', [
  'PENDING',
  'DP_PAID',
  'PRODUCTION',
  'LUNAS',
])

export const attachmentStage = pgEnum('attachment_stage', [
  'DP_RECEIPT',
  'PROGRESS_PIC',
  'FINAL_LUNAS',
])

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
})

export const customers = pgTable('customers', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
  location: varchar('location', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const orders = pgTable('orders', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id, {
    onDelete: 'restrict',
  }),
  requirements: text('requirements').notNull(),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull(),
  downPayment: numeric('down_payment', { precision: 12, scale: 2 })
    .default('0')
    .notNull(),
  orderDate: date('order_date'),
  status: orderStatus('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const orderAttachments = pgTable('order_attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  stage: attachmentStage('stage').notNull(),
  imageUrl: text('image_url').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type OrderAttachment = typeof orderAttachments.$inferSelect
export type NewOrderAttachment = typeof orderAttachments.$inferInsert
