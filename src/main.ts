import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { TemplateInterceptor } from './interceptors/template.interceptor';
import { join } from 'path';
import { engine as hbsEngine } from 'express-handlebars';
import hbsHelpers from './helpers/hbsHelpers';

const hbsConfig = hbsEngine({
  extname: 'hbs',
  defaultLayout: 'default',
  partialsDir: join(__dirname, '..', 'views/partials'),
  layoutsDir: join(__dirname, '..', 'views/layouts'),
  helpers: hbsHelpers,
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TemplateInterceptor(new Reflector()));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('hbs', hbsConfig);
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
