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

  async getParticipants(chatSpaceId: number) {
    // チャットスペースの参加者を取得
    const chatSpace = await this.prisma.chatSpace.findUnique({
      where: { id: chatSpaceId },
      include: { ChatSpaceMember: true },
    });

    if (!chatSpace) {
      throw new Error('ChatSpace not found');
    }

    // 参加者のユーザー情報を取得
    const participants = await Promise.all(
      chatSpace.ChatSpaceMember.map(async (member) => {
        const user = await this.prisma.user.findUnique({
          where: { id: member.memberId },
        });
        return user;
      }),
    );

    return participants;
  }
}
