import { Module } from '@nestjs/common';
import { ChatSpacesService } from './chat-spaces.service';
import { ChatSpacesController } from './chat-spaces.controller';

@Module({
  controllers: [ChatSpacesController],
  providers: [ChatSpacesService]
})
export class ChatSpacesModule {}
