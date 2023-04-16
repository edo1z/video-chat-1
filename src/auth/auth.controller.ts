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
import { CreateUserInput } from './dto/create-user.input';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('register')
  @Render('register')
  getRegister() {
    return {};
  }

  @Post('register')
  async postRegister(@Body() createUserInput: CreateUserInput, @Res() res) {
    await this.authService.createUser(createUserInput);
    res.redirect('/auth/login');
  }

  @Get('login')
  @Render('login')
  getLogin() {
    return {};
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async postLogin(@Req() req: Request) {
    await this.authService.login(req['user']);
    const response = { user: req['user'], message: 'ログインに成功しました' };
    return response;
  }
}
