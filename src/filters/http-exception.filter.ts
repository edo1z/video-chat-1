import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const template = request.template;
    switch (status) {
      case 401:
        const email = 'email' in request.body ? request.body.email : '';
        const error_message = email
          ? 'Authentication failed'
          : 'Please sign in';
        response.render('sign-in', { email, error_message });
        break;
      case 403:
        response.status(status).redirect('/auth/sign-in');
        break;
      case 404:
        response.render(template || 'error', {
          status,
          error_message: 'Not found',
          ...request.body,
        });
        break;
      default:
        response.render(template || 'error', {
          status,
          error_message: 'An unknown error occurred',
          ...request.body,
        });
    }
  }
}
