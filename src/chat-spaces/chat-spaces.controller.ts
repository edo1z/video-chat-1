import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  UseGuards,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatSpacesService } from './chat-spaces.service';
import { CreateChatSpaceDto } from './dto/create-chat-space.dto';
import { UpdateChatSpaceDto } from './dto/update-chat-space.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { v4 as uuidv4 } from 'uuid';

@UseGuards(AuthenticatedGuard)
@Controller('chat-spaces')
export class ChatSpacesController {
  constructor(private readonly chatSpacesService: ChatSpacesService) {}

  @Get('create')
  @Render('create-chat-space')
  getCreate() {
    return {};
  }

  @Post('create')
  async postCreate(
    @Body() createChatSpaceDto: CreateChatSpaceDto,
    @Req() req,
    @Res() res,
  ) {
    const ownerId = req.user['id'];
    const url = uuidv4();
    await this.chatSpacesService.create(createChatSpaceDto, ownerId, url);
    res.redirect('/home');
  }

  // TODO https://xxxx.com/c/userId/uuid-of-chat-space
  @Get('/c/:userId/:url')
  @Render('chat-space')
  getChatSpace(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('url') url: string,
  ) {
    return { url };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatSpaceDto: UpdateChatSpaceDto,
  ) {
    return this.chatSpacesService.update(+id, updateChatSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatSpacesService.remove(+id);
  }
}
