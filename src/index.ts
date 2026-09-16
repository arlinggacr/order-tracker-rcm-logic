import { Elysia } from 'elysia'
import { authModule } from './modules/auth/auth.module'
import { healthModule } from './modules/health/health.module'
import { ordersModule } from './modules/orders/orders.module'

const port = Number(process.env.PORT ?? 8000)

const app = new Elysia()
  .get('/', () => ({ name: 'order-tracker-rcm-logic', status: 'ok' }))
  .use(healthModule)
  .use(authModule)
  .use(ordersModule)
  .listen(port)

console.log(`🦊 Elysia is running at at ${app.server?.url}`)
