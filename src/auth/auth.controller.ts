import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('sign-up')
  @Render('sign-up')
  getSignUp() {
    return {};
  }

  @Post('sign-up')
  async postSignUp(@Body() signUpInput: SignUpInput, @Res() res) {
    await this.authService.createUser(signUpInput);
    res.redirect('/auth/sign-in');
  }

  @Get('sign-in')
  @Render('sign-in')
  getSignIn() {
    return {};
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async postSignIn(@Req() req: Request) {
    await this.authService.signIn(req['user']);
    const response = { user: req['user'], message: 'ログインに成功しました' };
    return response;
  }
}
