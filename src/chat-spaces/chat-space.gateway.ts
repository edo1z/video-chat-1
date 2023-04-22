import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSpacesService, ChatSpaceParticipant } from './chat-spaces.service';

@WebSocketGateway()
export class ChatSpacesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatSpacesService: ChatSpacesService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('ChatSpacesGateway Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected', client.id);

    // チャットスペースIDを取得（実際のアプリケーションでは、適切な方法でチャットスペースIDを取得する必要があります）
    const chatSpaceId = 1;
    const userName = `User-${client.id}`;
    const chatSpaceRoom = `chat-space-${chatSpaceId}`;

    // 参加者を追加し、更新された参加者一覧を取得
    const updatedParticipants = await this.chatSpacesService.addParticipant(
      chatSpaceId,
      client.id,
      userName,
    );
    client.join(chatSpaceRoom);
    // 更新された参加者一覧を全クライアントに送信
    this.server
      .to(chatSpaceRoom)
      .emit('updateParticipants', updatedParticipants);
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);

    const participant = await this.getParticipantBySocketId(client.id);
    if (!participant) return;

    // 参加者を削除し、更新された参加者一覧を取得
    const updatedParticipants = await this.chatSpacesService.removeParticipant(
      client.id,
      participant.chatSpaceId,
    );

    // 更新された参加者一覧を全クライアントに送信
    this.server
      .to(`chat-space-${participant.chatSpaceId}`)
      .emit('updateParticipants', updatedParticipants);
  }

  private async getParticipantBySocketId(
    socketId: string,
  ): Promise<ChatSpaceParticipant | null> {
    const onlineParticipants = this.chatSpacesService.getOnlineParticipants();
    for (const chatSpaceId in onlineParticipants) {
      const participant = onlineParticipants[chatSpaceId].find(
        (p) => p.socketId === socketId,
      );
      if (participant) return participant;
    }
    return null;
  }

  // @SubscribeMessage('joinChatSpace')
  // async handleJoinChatSpace(
  //   client: Socket,
  //   payload: { chatSpaceId: number; userId: number },
  // ): Promise<void> {
  //   console.log('joinChatSpace', payload);

  //   const username = 'まさお';
  //   const chatSpaceRoom = `chat-space-${payload.chatSpaceId}`;
  //   client.join(chatSpaceRoom);

  //   // 参加者をチャットスペースに追加
  //   const updatedParticipants = await this.chatSpacesService.addParticipant(
  //     payload.chatSpaceId,
  //     client.id,
  //     username,
  //   );
  //   console.log(updatedParticipants);

  //   // 参加者一覧をリアルタイムでクライアントに送信
  //   this.server
  //     .to(chatSpaceRoom)
  //     .emit('updateParticipants', updatedParticipants);
  // }
}
