import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '../../../db'
import {
  customers,
  orderAttachments,
  orders,
  paymentHistory,
} from '../../../db/schema'

export class OrdersRepository {
  async findAll() {
    return db
      .select()
      .from(orders)
      .where(isNull(orders.deletedAt))
      .orderBy(desc(orders.createdAt))
  }

  async findCustomers() {
    return db.select().from(customers).orderBy(desc(customers.createdAt))
  }

  async findById(id: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, id), isNull(orders.deletedAt)))

    return order
  }

  async create(data: typeof orders.$inferInsert) {
    const [order] = await db.insert(orders).values(data).returning()
    return order
  }

  async createWithInitialPayment(
    data: typeof orders.$inferInsert,
    paymentAmount: string,
  ) {
    return db.transaction(async (transaction) => {
      const [order] = await transaction.insert(orders).values(data).returning()

      if (Number(paymentAmount) > 0) {
        await transaction.insert(paymentHistory).values({
          orderId: order.id,
          amount: paymentAmount,
          paymentDate: data.orderDate ?? undefined,
          note: 'Initial down payment',
        })
      }

      return order
    })
  }

  async createPayment(data: typeof paymentHistory.$inferInsert) {
    const [payment] = await db.insert(paymentHistory).values(data).returning()
    return payment
  }

  async update(id: number, data: Partial<typeof orders.$inferInsert>) {
    const [order] = await db
      .update(orders)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(orders.id, id), isNull(orders.deletedAt)))
      .returning()

    return order
  }

  async softDelete(id: number) {
    const [order] = await db
      .update(orders)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(orders.id, id), isNull(orders.deletedAt)))
      .returning({ id: orders.id })

    return order
  }

  async findAttachmentsByOrderId(orderId: number) {
    return db
      .select()
      .from(orderAttachments)
      .where(eq(orderAttachments.orderId, orderId))
      .orderBy(desc(orderAttachments.uploadedAt))
  }

  async findPaymentsByOrderId(orderId: number) {
    return db
      .select()
      .from(paymentHistory)
      .where(eq(paymentHistory.orderId, orderId))
      .orderBy(desc(paymentHistory.paymentDate), desc(paymentHistory.createdAt))
  }

  async findCustomerById(id: number) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))

    return customer
  }
}
