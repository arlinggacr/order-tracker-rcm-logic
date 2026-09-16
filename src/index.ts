import { Elysia } from 'elysia'
import { authModule } from './modules/auth/auth.module'
import { healthModule } from './modules/health/health.module'
import { ordersModule } from './modules/orders/orders.module'

const port = Number(process.env.PORT ?? 8000)
const requestStartTimes = new WeakMap<Request, number>()

const app = new Elysia()
  .onRequest(({ request }) => {
    requestStartTimes.set(request, performance.now())
  })
  .onAfterHandle(({ request, set }) => {
    const startedAt = requestStartTimes.get(request) ?? performance.now()
    const duration = (performance.now() - startedAt).toFixed(0)

    console.log(
      `[HTTP] ${request.method} ${new URL(request.url).pathname} ${set.status} ${duration}ms`,
    )
  })
  .onError(({ request, error, set }) => {
    const startedAt = requestStartTimes.get(request) ?? performance.now()
    const duration = (performance.now() - startedAt).toFixed(0)

    console.error(
      `[HTTP] ${request.method} ${new URL(request.url).pathname} ${set.status} ${duration}ms`,
      error,
    )
  })
  .get('/', () => ({ name: 'order-tracker-rcm-logic', status: 'ok' }))
  .use(healthModule)
  .use(authModule)
  .use(ordersModule)
  .listen(port)

console.log(`🦊 Elysia is running at at ${app.server?.url}`)
