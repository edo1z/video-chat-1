import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { ChatSpacesService } from './chat-spaces.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatSpacesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatSpacesService: ChatSpacesService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('ChatSpacesGateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChatSpace')
  async handleJoinChatSpace(
    client: Socket,
    payload: { chatSpaceId: number; userId: number },
  ): Promise<void> {
    // 参加者をチャットスペースに追加する処理を実装

    // 参加者一覧を取得
    const participants = await this.chatSpacesService.getParticipants(
      payload.chatSpaceId,
    );

    // 参加者一覧をリアルタイムでクライアントに送信
    this.server.emit('updateParticipants', participants);
  }
}
