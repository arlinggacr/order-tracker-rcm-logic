import { Elysia } from 'elysia'
import type { HealthService } from '../service/health.service'

export const createHealthController = (healthService: HealthService) =>
  new Elysia({ name: 'health-controller' }).get('/health', () =>
    healthService.getStatus(),
  )
