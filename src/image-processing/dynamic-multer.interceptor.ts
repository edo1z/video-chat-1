import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface InterceptorConfig {
  table: string;
  column: string;
  fieldName: string;
  resize?: { w: number; h: number; fit: boolean };
  thumbnails?: Array<{ w: number; h: number; fit: boolean }>;
  limit?: number;
  ext?: string[];
}

export class DynamicMulterInterceptor implements NestInterceptor {
  constructor(private readonly configs: { [key: string]: InterceptorConfig }) {}

  createStorage = (config: InterceptorConfig): multer.StorageEngine => {
    return diskStorage({
      destination: async (req, file, cb) => {
        const dir = `./public/images/${config.table}/${req.body.id}/${config.column}`;
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      },
      filename: async (req, file, cb) => {
        const ext = path.extname(file.originalname);
        // TODO : file type check
        const uuid = uuidv4();
        const filename = `${uuid}${ext}`;
        cb(null, filename);
      },
    });
  };

  upload = async (
    req,
    res,
    fieldName: string,
    storage: multer.StorageEngine,
  ) => {
    const upload = multer({ storage }).array(fieldName);
    await new Promise<void>((resolve, reject) =>
      upload(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }),
    );
  };

  resize = async (config: InterceptorConfig, originalPath: string) => {
    const resizedPath = originalPath.replace(
      path.extname(originalPath),
      `_${config.resize.w}x${config.resize.h}${path.extname(originalPath)}`,
    );
    await sharp(originalPath)
      .resize(config.resize.w, config.resize.h, {
        fit: config.resize.fit ? 'cover' : 'contain',
      })
      .toFile(resizedPath);
  };

  createThumbnails = async (
    config: InterceptorConfig,
    originalPath: string,
  ) => {
    for (const thumbnail of config.thumbnails) {
      const thumbnailPath = originalPath.replace(
        path.extname(originalPath),
        `_${thumbnail.w}x${thumbnail.h}${path.extname(originalPath)}`,
      );
      await sharp(originalPath)
        .resize(thumbnail.w, thumbnail.h, {
          fit: thumbnail.fit ? 'cover' : 'contain',
        })
        .toFile(thumbnailPath);
    }
  };

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    for (const fieldName in this.configs) {
      const config = this.configs[fieldName];
      const storage = await this.createStorage(config);
      await this.upload(req, res, fieldName, storage);
      const file = req.files.find((file) => file.fieldname === fieldName);
      if (!file) continue;
      const baseDir = `./public/images/${config.table}/${req.body.id}/${config.column}`;
      const originalPath = `${baseDir}/${file.filename}`;
      if (config.resize) await this.resize(config, originalPath);
      if (config.thumbnails) await this.createThumbnails(config, originalPath);
      if (config.resize || config.thumbnails) await fs.unlink(originalPath);
    }

    return next.handle();
  }
}
