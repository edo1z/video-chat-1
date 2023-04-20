import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, throwError } from 'rxjs';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

export interface InterceptorConfig {
  table: string;
  column: string;
  fieldName: string;
  resize?: {
    w: number;
    h: number;
    fit: boolean;
  };
  thumbnails?: Array<{
    w: number;
    h: number;
    fit: boolean;
  }>;
  limit?: number;
  ext?: string[];
}

export class DynamicMulterInterceptor implements NestInterceptor {
  constructor(private readonly configs: { [key: string]: InterceptorConfig }) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    for (const fieldName in this.configs) {
      const config = this.configs[fieldName];
      const storage = diskStorage({
        destination: (req, file, cb) => {
          const dir = `./public/images/${config.table}/${req.body.id}/${config.column}`;
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: async (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const fileType = await fileTypeFromBuffer(file.buffer);

          if (!fileType || !config.ext.includes(fileType.ext)) {
            cb(new BadRequestException('Invalid file type'), null);
            return;
          }

          const uuid = uuidv4();
          const filename = `${uuid}_${config.resize.w}x${config.resize.h}${ext}`;
          cb(null, filename);
        },
      });

      const file = request[fieldName];
      if (!file) continue;

      const multerInterceptor = FileInterceptor(fieldName, { storage });
      const multerInterceptorInstance = new multerInterceptor();

      await new Promise((resolve, reject) => {
        (
          multerInterceptorInstance.intercept(
            {
              ...context,
              switchToHttp: () => ({
                getRequest: () => ({ ...request, file }),
                getResponse: () => response,
                getNext: context.switchToHttp().getNext.bind(context),
              }),
              getType: context.getType.bind(context),
              getArgs: context.getArgs.bind(context),
              getHandler: context.getHandler.bind(context),
              getClass: context.getClass.bind(context),
            },
            {
              handle: () =>
                throwError(() => new Error('This should never be called')),
            },
          ) as Promise<Observable<any>>
        )
          .then(resolve)
          .catch(reject);
      });

      const baseDir = `./public/images/${config.table}/${request.body.id}/${config.column}`;
      const originalPath = `${baseDir}/${file.filename}`;

      if (config.resize) {
        const resizedPath = originalPath.replace(
          path.extname(originalPath),
          `_${config.resize.w}x${config.resize.h}${path.extname(originalPath)}`,
        );
        await sharp(originalPath)
          .resize({
            width: config.resize.w,
            height: config.resize.h,
            fit: config.resize.fit ? sharp.fit.cover : sharp.fit.contain,
          })
          .toFile(resizedPath);
      }

      if (config.thumbnails) {
        for (const thumbnail of config.thumbnails) {
          const thumbnailPath = originalPath.replace(
            path.extname(originalPath),
            `_${thumbnail.w}x${thumbnail.h}${path.extname(originalPath)}`,
          );
          await sharp(originalPath)
            .resize({
              width: thumbnail.w,
              height: thumbnail.h,
              fit: thumbnail.fit ? sharp.fit.cover : sharp.fit.contain,
            })
            .toFile(thumbnailPath);
        }
      }
      fs.unlinkSync(originalPath);
    }
    return next.handle();
  }
}
