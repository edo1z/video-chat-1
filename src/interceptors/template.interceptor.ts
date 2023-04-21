import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TEMPLATE } from '../helpers/template.decorators';
import { Observable } from 'rxjs';

@Injectable()
export class TemplateInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const template = this.reflector.get<string>(TEMPLATE, context.getHandler());
    context.switchToHttp().getRequest().template = template;
    return next.handle();
  }
}
