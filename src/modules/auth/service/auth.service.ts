import type { AuthRepository } from '../repository/auth.repository'

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

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

    return { id: user.id, email: user.email }
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(
      email.trim().toLowerCase(),
    )

    if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
      throw new Error('Invalid email or password')
    }

    return { id: user.id, email: user.email }
  }
}
