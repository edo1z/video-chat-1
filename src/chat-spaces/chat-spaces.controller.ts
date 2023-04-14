import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { ChatSpacesService } from './chat-spaces.service';
import { CreateChatSpaceDto } from './dto/create-chat-space.dto';
import { UpdateChatSpaceDto } from './dto/update-chat-space.dto';

@Controller('chat-spaces')
export class ChatSpacesController {
  constructor(private readonly chatSpacesService: ChatSpacesService) {}

  @Get('create')
  @Render('create-chat-space')
  getCreate() {
    return {};
  }

  @Post('create')
  postCreate(@Body() createChatSpaceDto: CreateChatSpaceDto) {
    return this.chatSpacesService.create(createChatSpaceDto);
  }

  @Get()
  findAll() {
    return this.chatSpacesService.findAll();
  }

  @Get(':url')
  @Render('chat-space')
  getChatSpace(@Param('url') url: string) {
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
