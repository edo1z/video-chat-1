import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggedInInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const loggedIn = request.isAuthenticated();
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'object') {
          data.loggedIn = loggedIn;
        }
        return data;
      }),
    );
  }
}
