import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('LocalAuthGuard!!!');
    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());
    return result;
  }
  handleRequest(err, user, _, context: ExecutionContext) {
    if (err || !user) return null;
    const request = context.switchToHttp().getRequest();
    request.user = user;
    super.logIn(request);
    return user;
  }
}
