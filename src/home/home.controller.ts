import { Controller, Get, Render, UseGuards, Req } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { ChatSpacesService } from '../chat-spaces/chat-spaces.service';

@Controller('home')
export class HomeController {
  constructor(private readonly chatSpacesService: ChatSpacesService) {}

  @Get('')
  @UseGuards(AuthenticatedGuard)
  @Render('home')
  async getHome(@Req() req) {
    const chatSpaces = await this.chatSpacesService.findAllByUserId(
      req.user.id,
    );

    const chatSpacesWithUrl = chatSpaces.map((chatSpace) => ({
      ...chatSpace,
      url: `http://localhost:3000/c/${req.user.id}/${chatSpace.url}`,
    }));

    console.log('chatSpacesWithUrl', chatSpacesWithUrl);

    return {
      username: req.user.username,
      picture: req.user.picture,
      chatSpaces: chatSpacesWithUrl,
    };
  }
}
