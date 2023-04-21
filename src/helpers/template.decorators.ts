import { SetMetadata } from '@nestjs/common';

export const TEMPLATE = 'template';
export const Template = (template: string) => SetMetadata(TEMPLATE, template);
