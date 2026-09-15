import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { users, type NewUser } from '../../../db/schema'

export class AuthRepository {
  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
  }

  async createUser(user: NewUser) {
    const [createdUser] = await db.insert(users).values(user).returning()
    return createdUser
  }
}
