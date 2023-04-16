import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { IsPasswordConfirmationMatch } from 'src/validations/password-confirmation-validator';

export class SignUpInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @IsPasswordConfirmationMatch('password')
  confirm_password: string;
}
