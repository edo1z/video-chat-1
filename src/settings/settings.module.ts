import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SettingsController],
})
export class SettingsModule {}
