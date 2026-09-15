import { createHealthController } from './controller/health.controller'
import { HealthRepository } from './repository/health.repository'
import { HealthService } from './service/health.service'

const healthRepository = new HealthRepository()
const healthService = new HealthService(healthRepository)

export const healthModule = createHealthController(healthService)
