import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : (response as any)?.message ?? exception.message ?? 'Error';
      const type = this.typeFromStatus(status);
      const details = typeof response === 'object' ? (response as any)?.message ?? undefined : undefined;
      res.status(status).json({
        code: status,
        type,
        message,
        details,
      });
      return;
    }

    const message = (exception as any)?.message ?? 'Internal server error';
    res.status(500).json({
      code: 500,
      type: 'InternalError',
      message,
    });
  }

  private typeFromStatus(status: number): string {
    switch (status) {
      case 400:
        return 'BadRequest';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'NotFound';
      case 409:
        return 'Conflict';
      case 422:
        return 'UnprocessableEntity';
      default:
        return 'Error';
    }
  }
}
