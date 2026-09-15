import { createOrdersController } from './controller/orders.controller'
import { OrdersRepository } from './repository/orders.repository'
import { OrdersService } from './service/orders.service'

const ordersRepository = new OrdersRepository()
const ordersService = new OrdersService(ordersRepository)

export const ordersModule = createOrdersController(ordersService)
