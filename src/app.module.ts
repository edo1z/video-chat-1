import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatSpacesModule } from './chat-spaces/chat-spaces.module';
import { AuthController } from './auth/auth.controller';
import { HomeController } from './home/home.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [UsersModule, ChatSpacesModule, AuthModule, PassportModule, InvitationsModule],
  controllers: [AppController, AuthController, HomeController],
  providers: [AppService],
})
export class AppModule {}
