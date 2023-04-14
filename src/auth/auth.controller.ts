import { Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
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
