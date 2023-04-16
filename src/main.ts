import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import hbsHelpers from './helpers/hbsHelpers';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      defaultLayout: 'default',
      partialsDir: join(__dirname, '..', 'views/partials'),
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      helpers: hbsHelpers,
    }),
  );
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
