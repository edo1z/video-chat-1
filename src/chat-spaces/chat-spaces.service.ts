import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateChatSpaceDto } from './dto/create-chat-space.dto';
import { UpdateChatSpaceDto } from './dto/update-chat-space.dto';

@Injectable()
export class ChatSpacesService {
  constructor(private prisma: PrismaService) {}

  create(createChatSpaceDto: CreateChatSpaceDto, ownerId: number, url: string) {
    return this.prisma.chatSpace.create({
      data: {
        ...createChatSpaceDto,
        url,
        owner: {
          connect: {
            id: ownerId,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.chatSpace.findMany();
  }

  findOne(id: number) {
    return this.prisma.chatSpace.findUnique({ where: { id } });
  }

  findAllByUserId(ownerId: number) {
    return this.prisma.chatSpace.findMany({ where: { ownerId } });
  }

  update(id: number, updateChatSpaceDto: UpdateChatSpaceDto) {
    return this.prisma.chatSpace.update({
      where: { id },
      data: updateChatSpaceDto,
    });
  }

  remove(id: number) {
    return this.prisma.chatSpace.delete({ where: { id } });
  }
}
