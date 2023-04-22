import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateChatSpaceDto } from './dto/create-chat-space.dto';
import { UpdateChatSpaceDto } from './dto/update-chat-space.dto';

export interface ChatSpaceParticipant {
  chatSpaceId: number;
  socketId: string;
  username: string;
}

@Injectable()
export class ChatSpacesService {
  // TODO:Redisとかにする
  // TODO:chatSpaceId, userIDとかが改竄可能(JWTとか使う)
  private chatSpaceParticipants: { [key: number]: any[] } = {};

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

  // WebSocketを介してリアルタイムに接続されているクライアント
  getOnlineParticipants(): { [key: number]: any[] } {
    return this.chatSpaceParticipants;
  }

  // プライベートなチャットスペースに関連付けられたメンバー
  async getChatSpaceMembersFromDB(chatSpaceId: number) {
    const chatSpace = await this.prisma.chatSpace.findUnique({
      where: { id: chatSpaceId },
      include: { ChatSpaceMember: true },
    });
    if (!chatSpace) throw new Error('ChatSpace not found');
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

  async addParticipant(
    chatSpaceId: number,
    clientId: string,
    username: string,
  ) {
    console.log('addParticipant', username, clientId, chatSpaceId);
    const newParticipant = { chatSpaceId, socketId: clientId, username };
    if (!this.chatSpaceParticipants[chatSpaceId]) {
      this.chatSpaceParticipants[chatSpaceId] = [];
    }
    this.chatSpaceParticipants[chatSpaceId].push(newParticipant);
    return this.chatSpaceParticipants[chatSpaceId];
  }

  async removeParticipant(clientId: string, chatSpaceId: number) {
    if (!this.chatSpaceParticipants[chatSpaceId]) return [];
    this.chatSpaceParticipants[chatSpaceId] = this.chatSpaceParticipants[
      chatSpaceId
    ].filter((participant) => participant.socketId !== clientId);
    return this.chatSpaceParticipants[chatSpaceId];
  }
}
