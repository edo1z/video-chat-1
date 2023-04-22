import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : 500;
    const errorMessage = isHttpException
      ? exception.getResponse()
      : 'Internal server error';
    const template = request.template;

    switch (status) {
      case 401:
        const email = 'email' in request.body ? request.body.email : '';
        response.render('sign-in', { email, error_message: errorMessage });
        break;
      case 403:
        response.status(status).redirect('/auth/sign-in');
        break;
      case 404:
        response.render(template || 'error', {
          status,
          error_message: errorMessage,
          ...request.body,
        });
        break;
      default:
        console.error('ERROR!', `[${status}]`, exception.message, errorMessage);
        response.render(template || 'error', {
          status,
          error_message: errorMessage,
          ...request.body,
        });
    }
  }
}
