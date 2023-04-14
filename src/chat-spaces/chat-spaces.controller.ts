import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatSpacesService } from './chat-spaces.service';
import { CreateChatSpaceDto } from './dto/create-chat-space.dto';
import { UpdateChatSpaceDto } from './dto/update-chat-space.dto';

@Controller('chat-spaces')
export class ChatSpacesController {
  constructor(private readonly chatSpacesService: ChatSpacesService) {}

  @Post()
  create(@Body() createChatSpaceDto: CreateChatSpaceDto) {
    return this.chatSpacesService.create(createChatSpaceDto);
  }

  @Get()
  findAll() {
    return this.chatSpacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatSpacesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatSpaceDto: UpdateChatSpaceDto) {
    return this.chatSpacesService.update(+id, updateChatSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatSpacesService.remove(+id);
  }
}
