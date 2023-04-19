import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { IsPasswordConfirmationMatch } from 'src/validations/password-confirmation-validator';

export class UpdatePasswordDto {
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
