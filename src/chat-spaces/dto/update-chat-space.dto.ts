import { PartialType } from '@nestjs/mapped-types';
import { CreateChatSpaceDto } from './create-chat-space.dto';

export class UpdateChatSpaceDto extends PartialType(CreateChatSpaceDto) {}
