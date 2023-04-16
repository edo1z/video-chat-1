import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async createUser(createUserInput: CreateUserInput) {
    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);
    delete createUserInput.confirm_password;
    return this.userService.create(createUserInput);
  }

  // email, passwordを受け取り検証する
  // 検証OKであれば、ユーザ情報を返す
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: any) {
    // ユーザ情報を元に、ログインセッションを作成し、データベースに保存する
    // ログイン情報の検証がOKの場合に実施する
  }
}
