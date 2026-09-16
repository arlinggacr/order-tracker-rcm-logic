import type { HealthRepository } from '../repository/health.repository'

export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async getStatus() {
    try {
      const database = await this.healthRepository.checkDatabase()

      return {
        status: database ? 'ok' : 'degraded',
        database: database ? 'ok' : 'unavailable',
      }
    } catch (error) {
      console.error('[HealthService.getStatus]', error)
      throw error
    }
  }
}
