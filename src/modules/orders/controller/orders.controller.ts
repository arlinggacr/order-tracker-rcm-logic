import { Elysia, t } from 'elysia'
import { ResponseHandler } from '../../../../libs/common/responses'
import type { OrdersService } from '../service/orders.service'

export const createOrdersController = (ordersService: OrdersService) =>
  new Elysia({ name: 'orders-controller' })
    .post(
      '/orders',
      async ({ body, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.create(body),
            'Order created',
            undefined,
            201,
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      {
        body: t.Object({
          id: t.Integer(),
          customerId: t.Optional(t.Integer()),
          requirements: t.String({ minLength: 1 }),
          totalPrice: t.String(),
          downPayment: t.Optional(t.String()),
          orderDate: t.Optional(t.String()),
          status: t.Optional(
            t.Union([
              t.Literal('PENDING'),
              t.Literal('DP_PAID'),
              t.Literal('PRODUCTION'),
              t.Literal('LUNAS'),
            ]),
          ),
        }),
      },
    )
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
    .get('/customers', async ({ set }) => {
      try {
        return ResponseHandler.success(
          set,
          await ordersService.getCustomers(),
          'Customers retrieved',
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
    .get(
      '/orders/:id/attachments',
      async ({ params, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.getAttachments(params.id),
            'Order pictures retrieved',
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      { params: t.Object({ id: t.Numeric() }) },
    )
    .patch(
      '/orders/:id',
      async ({ params, body, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.update(params.id, body),
            'Order updated',
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(
          t.Object({
            customerId: t.Optional(t.Integer()),
            requirements: t.String({ minLength: 1 }),
            totalPrice: t.String(),
            downPayment: t.String(),
            orderDate: t.String(),
            status: t.Union([
              t.Literal('PENDING'),
              t.Literal('DP_PAID'),
              t.Literal('PRODUCTION'),
              t.Literal('LUNAS'),
            ]),
          }),
        ),
      },
    )
    .delete(
      '/orders/:id',
      async ({ params, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.remove(params.id),
            'Order deleted',
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      { params: t.Object({ id: t.Numeric() }) },
    )
    .post(
      '/orders/:id/payments',
      async ({ params, body, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.createPayment({
              orderId: params.id,
              amount: body.amount,
              paymentDate: body.paymentDate,
              note: body.note,
            }),
            'Payment history created',
            undefined,
            201,
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Object({
          amount: t.String(),
          paymentDate: t.Optional(t.String()),
          note: t.Optional(t.String()),
        }),
      },
    )
    .get(
      '/orders/:id/payments',
      async ({ params, set }) => {
        try {
          return ResponseHandler.success(
            set,
            await ordersService.getPayments(params.id),
            'Payment history retrieved',
          )
        } catch (error) {
          return ResponseHandler.error(set, error)
        }
      },
      { params: t.Object({ id: t.Numeric() }) },
    )
