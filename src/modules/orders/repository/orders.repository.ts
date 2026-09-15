import { desc, eq } from 'drizzle-orm'
import { db } from '../../../db'
import { orders } from '../../../db/schema'

export class OrdersRepository {
  async findAll() {
    return db.select().from(orders).orderBy(desc(orders.createdAt))
  }

  async findById(id: number) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id))

    return order
  }
}
