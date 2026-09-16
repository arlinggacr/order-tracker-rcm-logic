import { Elysia, t } from 'elysia'
import { ResponseHandler } from '../../../../libs/common/responses'
import type { AuthService } from '../service/auth.service'

export const createAuthController = (authService: AuthService) =>
  new Elysia({ name: 'auth-controller' })
    .post(
      '/auth/register',
      async ({ body, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await authService.register(body.email, body.password),
            'Registration successful',
            undefined,
            201,
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
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
          return ResponseHandler.success(
            set,
            await authService.login(body.email, body.password),
            'Login successful',
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      {
        body: t.Object({
          email: t.String({ format: 'email' }),
          password: t.String({ minLength: 8 }),
        }),
      },
    )
