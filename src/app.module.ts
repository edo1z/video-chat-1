import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatSpacesModule } from './chat-spaces/chat-spaces.module';

@Module({
  imports: [UsersModule, ChatSpacesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
