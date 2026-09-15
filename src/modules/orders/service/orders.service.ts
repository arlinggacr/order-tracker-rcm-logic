import type { OrdersRepository } from '../repository/orders.repository'

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  getAll() {
    return this.ordersRepository.findAll()
  }

  getById(id: number) {
    return this.ordersRepository.findById(id)
  }
}
