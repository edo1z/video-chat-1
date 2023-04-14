import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
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
  postRegister(@Body() createUserDto: CreateUserDto) {
    // ユーザー登録の処理を実装
    // 登録が成功したらホーム画面にリダイレクト
    // 失敗したらエラーメッセージを表示
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
    return { message: 'ログインに成功しました' };
  }
}
