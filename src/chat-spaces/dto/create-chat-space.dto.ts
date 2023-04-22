import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateChatSpaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPrivate: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}
