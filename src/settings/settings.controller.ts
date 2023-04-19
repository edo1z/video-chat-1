import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('settings')
export class SettingsController {
  @Get('user')
  @Render('settings/user')
  user() {
    return {};
  }
  @Post()
  postUser(@Body() updateUserDto: UpdateUserDto) {
    return {};
  }

  @Get('password')
  @Render('settings/password')
  password() {
    return {};
  }
  @Post()
  postPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return {};
  }

  @Get('email')
  @Render('settings/email')
  email() {
    return {};
  }
  @Post()
  postEmail(@Body() updateEmailDto: UpdateEmailDto) {
    return {};
  }

  @Get('delete-account')
  @Render('settings/delete_account')
  deleteAccount() {
    return {};
  }
  @Post('delete-account')
  deleteDeleteAccount() {
    return {};
  }
}
