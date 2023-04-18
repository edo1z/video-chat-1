import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('LocalAuthGuard!!!');
    const result = (await super.canActivate(context)) as boolean;
    console.log('result!!!', result);
    await super.logIn(context.switchToHttp().getRequest());
    return result;
  }
}
