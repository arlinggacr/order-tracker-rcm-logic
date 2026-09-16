import type { OrdersRepository } from '../repository/orders.repository'
import { NotFoundError } from '../../../../libs/common/responses'

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  getAll() {
    return this.ordersRepository.findAll()
  }

  async getById(id: number) {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    return order
  }
}
