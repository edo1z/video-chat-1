import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { engine } from 'express-handlebars';
import hbsHelpers from './helpers/hbsHelpers';
import * as session from 'express-session';
import * as ConnectPgSimple from 'connect-pg-simple';
import * as pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use(sessionConfig);
  app.engine('hbs', hbsConfig);
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();

const sessionConfig = session({
  store: new (ConnectPgSimple(session))({
    pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
    tableName: 'Session',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1週間
  },
});

const hbsConfig = engine({
  extname: 'hbs',
  defaultLayout: 'default',
  partialsDir: join(__dirname, '..', 'views/partials'),
  layoutsDir: join(__dirname, '..', 'views/layouts'),
  helpers: hbsHelpers,
});
