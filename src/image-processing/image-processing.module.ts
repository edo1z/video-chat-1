import { Module } from '@nestjs/common';
import { DynamicMulterInterceptor } from './dynamic-multer.interceptor';

@Module({
  providers: [DynamicMulterInterceptor],
  exports: [DynamicMulterInterceptor],
})
export class ImageProcessingModule {}
