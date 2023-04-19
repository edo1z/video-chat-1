import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedIn = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.isAuthenticated();
  },
);
