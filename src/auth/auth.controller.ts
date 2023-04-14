import { Controller, Get, Post, Render, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
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
  async postLogin(@Req() req: Request, @Res() res: Response) {
    // ログイン処理を実装します
  }
}
