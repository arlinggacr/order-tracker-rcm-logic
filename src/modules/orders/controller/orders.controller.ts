import { Elysia, t } from 'elysia'
import type { OrdersService } from '../service/orders.service'

export const createOrdersController = (ordersService: OrdersService) =>
  new Elysia({ name: 'orders-controller' })
    .get('/orders', () => ordersService.getAll())
    .get(
      '/orders/:id',
      async ({ params, set }) => {
        const order = await ordersService.getById(params.id)

        if (!order) {
          set.status = 404
          return { message: 'Order not found' }
        }

        return order
      },
      { params: t.Object({ id: t.Numeric() }) },
    )
