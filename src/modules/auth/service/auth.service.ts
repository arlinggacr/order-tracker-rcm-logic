import type { AuthRepository } from '../repository/auth.repository'
import { SignJWT } from 'jose'

const jwtSecret = process.env.JWT_SECRET_KEY

if (!jwtSecret) {
  throw new Error('JWT_SECRET_KEY is required')
}

const encodedJwtSecret = new TextEncoder().encode(jwtSecret)

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  private async createToken(user: { id: number; email: string }) {
    return new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(String(user.id))
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(encodedJwtSecret)
  }

  async register(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await this.authRepository.findByEmail(normalizedEmail)

    if (existingUser) {
      throw new Error('Email is already registered')
    }

    const passwordHash = await Bun.password.hash(password)
    const user = await this.authRepository.createUser({
      email: normalizedEmail,
      passwordHash,
    })

    const responseUser = { id: user.id, email: user.email }

    return { user: responseUser, token: await this.createToken(responseUser) }
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(
      email.trim().toLowerCase(),
    )

    if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
      throw new Error('Invalid email or password')
    }

    const responseUser = { id: user.id, email: user.email }

    return { user: responseUser, token: await this.createToken(responseUser) }
  }
}
