import { sql } from 'drizzle-orm'
import { db } from '../../../db'

export class HealthRepository {
  async checkDatabase(): Promise<boolean> {
    try {
      await db.execute(sql`select 1`)
      return true
    } catch {
      return false
    }
  }
}
