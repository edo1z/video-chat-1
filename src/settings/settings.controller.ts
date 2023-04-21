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
import {
  DynamicMulterInterceptor,
  InterceptorConfig,
} from '../image-processing/dynamic-multer.interceptor';

const multerConfig: InterceptorConfig = {
  table: 'users',
  column: 'picture',
  fieldName: 'picture',
  resize: { w: 200, h: 200, fit: true },
  thumbnails: [{ w: 50, h: 50, fit: true }],
  limit: 5,
  ext: ['jpg', 'jpeg', 'png'],
};

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
  @UseInterceptors(new DynamicMulterInterceptor({ picture: multerConfig }))
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
