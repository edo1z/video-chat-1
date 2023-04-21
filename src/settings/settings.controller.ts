import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Render,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { DynamicMulterInterceptor } from '../image-processing/dynamic-multer.interceptor';
import { Template } from '../helpers/template.decorators';

@UseGuards(AuthenticatedGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user')
  @Render('settings/user')
  async getUser(@Req() req) {
    const { username, bio, picture } = req.user;
    return { username, bio, picture };
  }

  @Post('user')
  @Template('settings/user')
  @UseInterceptors(
    new DynamicMulterInterceptor({
      table: 'users',
      column: 'picture',
      fieldName: 'picture',
      resize: { w: 400, h: 400, fit: true },
      thumbnails: [{ w: 100, h: 100, fit: true }],
      limit: 3072,
      ext: ['hoge', 'jpg', 'png'],
    }),
  )
  async postUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    updateUserDto.bio = updateUserDto.bio.trim();
    if (file) {
      updateUserDto.picture = file.path;
    }
    const userId = req.user['id'];
    console.log('userId!!', userId);
    await this.usersService.update(userId, updateUserDto);
    res.redirect('/settings/user');
  }

  @Get('password')
  @Render('settings/password')
  password() {
    return {};
  }

  @Post('password')
  postPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return {};
  }

  @Get('email')
  @Render('settings/email')
  email() {
    return {};
  }

  @Post('email')
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
