import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpInput } from './dto/sign-up.input';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async createUser(signUpInput: SignUpInput) {
    signUpInput.password = await bcrypt.hash(signUpInput.password, 10);
    delete signUpInput.confirm_password;
    return this.userService.create(signUpInput);
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

  async signIn(user: any) {
    // ユーザ情報を元に、ログインセッションを作成し、データベースに保存する
    // ログイン情報の検証がOKの場合に実施する
  }
}
