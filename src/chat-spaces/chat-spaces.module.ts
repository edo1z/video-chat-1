import { Module } from '@nestjs/common';
import { ChatSpacesService } from './chat-spaces.service';
import { ChatSpacesController } from './chat-spaces.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [ChatSpacesController],
  providers: [ChatSpacesService],
  exports: [ChatSpacesService],
})
export class ChatSpacesModule {}
