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
import { validate } from 'class-validator';
import { SignInInput } from './dto/sign-in.input';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('sign-up')
  @Render('sign-up')
  getSignUp() {
    return {};
  }

  @Post('sign-up')
  @Render('sign-up')
  async postSignUp(@Body() signUpInput: SignUpInput, @Res() res) {
    signUpInput = Object.assign(new SignUpInput(), signUpInput);
    const errors = await validate(signUpInput);
    if (errors.length > 0) return { ...signUpInput, errors };
    await this.authService.createUser(signUpInput);
    res.redirect('/auth/sign-in');
  }

  @Get('sign-in')
  @Render('sign-in')
  getSignIn() {
    return {};
  }

  @Post('sign-in')
  @Render('sign-in')
  @UseGuards(LocalAuthGuard)
  async postSignIn(@Body() signInInput: SignInInput, @Req() req, @Res() res) {
    if (!('user' in req) || !req['user']) {
      return { ...signInInput, error_message: 'ログインに失敗しました' };
    }
    req.session.user = req['user'];
    res.redirect('/home');
  }
}
