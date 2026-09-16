import { ClientError } from './client-error'
import type { PageHandler } from './page-handler'

type ResponseContext = {
  status?: number | string
}

export class ResponseHandler {
  static success<T>(
    context: ResponseContext,
    data: T,
    message: string,
    pagination?: PageHandler,
    code = 200,
  ) {
    context.status = code

    return {
      status: true,
      data,
      message,
      pagination: pagination
        ? {
            totalData: pagination.totalData,
            totalPage: pagination.totalPage,
            page: pagination.page,
          }
        : null,
    }
  }

  static error(context: ResponseContext, error: unknown) {
    if (error instanceof ClientError) {
      context.status = error.statusCode

      return {
        status: false,
        message: error.message,
        error: error.errors ?? null,
      }
    }

    if (error instanceof Error && this.isDatabaseUnavailable(error)) {
      context.status = 503

      return {
        status: false,
        message:
          'Database service is currently unavailable. Please try again later.',
      }
    }

    context.status = 500

    return {
      status: false,
      message: 'Maaf, terjadi kegagalan pada server kami.',
    }
  }

  private static isDatabaseUnavailable(error: Error) {
    const errorText = `${error.name} ${error.message} ${error.stack ?? ''}`

    return /ECONNREFUSED|PgBouncer|Npgsql|connection to database|failed to connect|timeout/i.test(
      errorText,
    )
  }
}
