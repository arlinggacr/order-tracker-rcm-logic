import { Elysia, t } from 'elysia'
import { ResponseHandler } from '../../../../libs/common/responses'
import type { OrdersService } from '../service/orders.service'

export const createOrdersController = (ordersService: OrdersService) =>
  new Elysia({ name: 'orders-controller' })
    .get('/orders', async ({ set }) => {
      try {
        return ResponseHandler.success(
          set,
          await ordersService.getAll(),
          'Orders retrieved',
        )
      } catch (error) {
        return ResponseHandler.error(set, error)
      }
    })
    .get(
      '/orders/:id',
      async ({ params, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.getById(params.id),
            'Order retrieved',
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      { params: t.Object({ id: t.Numeric() }) },
    )
