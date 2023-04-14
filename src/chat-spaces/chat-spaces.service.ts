import { Injectable } from '@nestjs/common';
import { CreateChatSpaceDto } from './dto/create-chat-space.dto';
import { UpdateChatSpaceDto } from './dto/update-chat-space.dto';

@Injectable()
export class ChatSpacesService {
  create(createChatSpaceDto: CreateChatSpaceDto) {
    return 'This action adds a new chatSpace';
  }

  findAll() {
    return `This action returns all chatSpaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatSpace`;
  }

  update(id: number, updateChatSpaceDto: UpdateChatSpaceDto) {
    return `This action updates a #${id} chatSpace`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatSpace`;
  }
}
