import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('home')
export class HomeController {
  @Get()
  @UseGuards(AuthenticatedGuard)
  @Render('home')
  getHome() {
    // ユーザー名とチャットスペースのリストを取得して表示する処理を実装
    return {
      username: 'John Doe', // 仮のユーザー名
      chatSpaces: [
        // 仮のチャットスペースリスト
        { id: 1, name: 'Chat Space 1' },
        { id: 2, name: 'Chat Space 2' },
      ],
    };
  }
}
