import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface DynamicMulterConfig {
  table: string;
  column: string;
  fieldName: string;
  resize?: { w: number; h: number; fit: boolean };
  thumbnails?: Array<{ w: number; h: number; fit: boolean }>;
  limit?: number;
  ext?: string[];
}

export class DynamicMulterInterceptor implements NestInterceptor {
  private readonly configs: DynamicMulterConfig[];
  private readonly DEFAULT_LIMIT = 5; // KB
  private readonly DEFAULT_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  constructor(
    private readonly _configs: DynamicMulterConfig[] | DynamicMulterConfig,
  ) {
    if (Array.isArray(this._configs)) {
      this.configs = this._configs;
    } else {
      this.configs = [this._configs];
    }
  }

  createStorage = (config: DynamicMulterConfig): multer.StorageEngine => {
    return diskStorage({
      destination: async (req, file, cb) => {
        const dir = `./public/images/${config.table}/temp/${config.column}`;
        await fs.mkdir(dir, { recursive: true });
        cb(null, dir);
      },
      filename: async (req, file, cb) => {
        const ext = path.extname(file.originalname).replace('.', '');
        const allowedExtensions = config.ext
          ? config.ext.filter((ext) => this.DEFAULT_EXT.includes(ext))
          : this.DEFAULT_EXT;
        const lowerCaseExt = ext.toLowerCase();
        if (
          !allowedExtensions.some(
            (allowedExt) =>
              lowerCaseExt === allowedExt ||
              (allowedExt === 'jpg' && lowerCaseExt === 'jpeg') ||
              (allowedExt === 'jpeg' && lowerCaseExt === 'jpg'),
          )
        ) {
          return cb(new Error('Invalid file type'), null);
        }
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
    limit: number,
  ) => {
    const upload = multer({
      storage,
      limits: { fileSize: limit * 1024 },
    }).array(fieldName);
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

  resize = async (
    config: DynamicMulterConfig,
    originalPath: string,
    tempDir: string,
    baseDir: string,
  ) => {
    const resizedPath = originalPath
      .replace(tempDir, baseDir)
      .replace(
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
    config: DynamicMulterConfig,
    originalPath: string,
    tempDir: string,
    baseDir: string,
  ) => {
    for (const thumbnail of config.thumbnails) {
      const thumbnailPath = originalPath
        .replace(tempDir, baseDir)
        .replace(
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

    for (const config of this.configs) {
      const storage = await this.createStorage(config);
      await this.upload(
        req,
        res,
        config.fieldName,
        storage,
        config.limit ?? this.DEFAULT_LIMIT,
      );
      const file = req.files.find(
        (file) => file.fieldname === config.fieldName,
      );
      if (!req.body.id) {
        throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
      }
      if (!file) continue;
      const baseDir = `./public/images/${config.table}/${req.body.id}/${config.column}`;
      const tempDir = `./public/images/${config.table}/temp/${config.column}`;
      const originalPath = `${tempDir}/${file.filename}`;
      if (config.resize)
        await this.resize(config, originalPath, tempDir, baseDir);
      if (config.thumbnails)
        await this.createThumbnails(config, originalPath, tempDir, baseDir);
      if (config.resize || config.thumbnails) await fs.unlink(originalPath);
    }

    return next.handle();
  }
}
