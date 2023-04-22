import { Module } from '@nestjs/common';
import { ChatSpacesService } from './chat-spaces.service';
import { ChatSpacesController } from './chat-spaces.controller';
import { ChatSpacesGateway } from './chat-space.gateway';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [ChatSpacesController],
  providers: [ChatSpacesService, ChatSpacesGateway],
  exports: [ChatSpacesService],
})
export class ChatSpacesModule {}
