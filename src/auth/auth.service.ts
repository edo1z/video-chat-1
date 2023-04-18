import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpInput } from './dto/sign-up.input';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async createUser(signUpInput: SignUpInput) {
    signUpInput.password = await bcrypt.hash(signUpInput.password, 10);
    delete signUpInput.confirm_password;
    return this.usersService.create(signUpInput);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }
}
