import { Elysia, t } from 'elysia'
import type { AuthService } from '../service/auth.service'

export const createAuthController = (authService: AuthService) =>
  new Elysia({ name: 'auth-controller' })
    .post(
      '/auth/register',
      async ({ body, set }) => {
        try {
          return await authService.register(body.email, body.password)
        } catch (error) {
          set.status = error instanceof Error ? 409 : 500
          return {
            message:
              error instanceof Error ? error.message : 'Unable to register',
          }
        }
      },
      {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String({ minLength: 8 }),
        }),
      },
    )
    .post(
      '/auth/login',
      async ({ body, set }) => {
        try {
          return await authService.login(body.email, body.password)
        } catch (error) {
          set.status = 401
          return {
            message: error instanceof Error ? error.message : 'Unable to login',
          }
        }
      },
      {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String({ minLength: 8 }),
        }),
      },
    )
