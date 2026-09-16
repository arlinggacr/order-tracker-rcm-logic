import type { OrdersRepository } from '../repository/orders.repository'
import {
  InvariantError,
  NotFoundError,
} from '../../../../libs/common/responses'
import type { NewOrder, NewPaymentHistory } from '../../../db/schema'

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getAll() {
    try {
      return await this.ordersRepository.findAll()
    } catch (error) {
      console.error('[OrdersService.getAll]', error)
      throw error
    }
  }

  async getCustomers() {
    try {
      return await this.ordersRepository.findCustomers()
    } catch (error) {
      console.error('[OrdersService.getCustomers]', error)
      throw error
    }
  }

  async getById(id: number) {
    try {
      const order = await this.ordersRepository.findById(id)

      if (!order) {
        throw new NotFoundError('Order not found')
      }

      const [customer, attachments, payments] = await Promise.all([
        order.customerId
          ? this.ordersRepository.findCustomerById(order.customerId)
          : Promise.resolve(undefined),
        this.ordersRepository.findAttachmentsByOrderId(id),
        this.ordersRepository.findPaymentsByOrderId(id),
      ])

      return { ...order, customer, attachments, payments }
    } catch (error) {
      console.error('[OrdersService.getById]', error)
      throw error
    }
  }

  async getAttachments(id: number) {
    try {
      return await this.ordersRepository.findAttachmentsByOrderId(id)
    } catch (error) {
      console.error('[OrdersService.getAttachments]', error)
      throw error
    }
  }

  async getPayments(id: number) {
    try {
      return await this.ordersRepository.findPaymentsByOrderId(id)
    } catch (error) {
      console.error('[OrdersService.getPayments]', error)
      throw error
    }
  }

  async create(data: NewOrder) {
    try {
      const existingOrder = await this.ordersRepository.findById(data.id)

      if (existingOrder) {
        throw new Error('Order already exists')
      }

      return await this.ordersRepository.createWithInitialPayment(
        data,
        data.downPayment ?? '0',
      )
    } catch (error) {
      console.error('[OrdersService.create]', error)
      throw error
    }
  }

  async update(id: number, data: Partial<NewOrder>) {
    try {
      const order = await this.ordersRepository.update(id, data)

      if (!order) {
        throw new NotFoundError('Order not found')
      }

      return order
    } catch (error) {
      console.error('[OrdersService.update]', error)
      throw error
    }
  }

  async remove(id: number) {
    try {
      const order = await this.ordersRepository.softDelete(id)

      if (!order) {
        throw new NotFoundError('Order not found')
      }

      return order
    } catch (error) {
      console.error('[OrdersService.remove]', error)
      throw error
    }
  }

  async createPayment(data: NewPaymentHistory) {
    try {
      if (Number(data.amount) <= 0) {
        throw new InvariantError('Payment amount must be greater than zero')
      }

      const order = await this.ordersRepository.findById(data.orderId)

      if (!order) {
        throw new NotFoundError('Order not found')
      }

      return await this.ordersRepository.createPayment(data)
    } catch (error) {
      console.error('[OrdersService.createPayment]', error)
      throw error
    }
  }
}
