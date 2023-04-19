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
  async postSignUp(@Body() signUpInput: SignUpInput, @Res() res) {
    signUpInput = Object.assign(new SignUpInput(), signUpInput);
    const errors = await validate(signUpInput);
    if (errors.length > 0)
      return res.render('sign-up', { ...signUpInput, errors });
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
  async postSignIn(@Body() signInInput: SignInInput, @Req() req, @Res() res) {
    res.redirect('/home');
  }

  @Get('sign-out')
  async getSignOut(@Req() req, @Res() res) {
    req.session.destroy();
    res.redirect('/auth/sign-in');
  }
}
