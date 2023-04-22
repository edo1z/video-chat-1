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
@Controller()
export class ChatSpacesController {
  constructor(private readonly chatSpacesService: ChatSpacesService) {}

  @Get('/chat-spaces/create')
  @Render('create-chat-space')
  getCreate() {
    return {};
  }

  @Post('/chat-spaces/create')
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

  @Get('/c/:userId/:url')
  @Render('chat-space')
  getChatSpace(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('url') url: string,
  ) {
    console.log('chat-space!!!');
    return { url };
  }

  @Patch('/chat-spaces/:id')
  update(
    @Param('id') id: string,
    @Body() updateChatSpaceDto: UpdateChatSpaceDto,
  ) {
    return this.chatSpacesService.update(+id, updateChatSpaceDto);
  }

  @Delete('/chat-spaces/:id')
  remove(@Param('id') id: string) {
    return this.chatSpacesService.remove(+id);
  }
}
