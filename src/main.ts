import { NestFactory } from '@nestjs/core';
import {
  INestApplication,
  Logger,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { blue } from 'colorette';

const logger: Logger = new Logger('bootstrap(');

const PORT: number = Number(process.env.PORT);
const HOST: string = String(process.env.HOST);
const MODE: string = String(process.env.MODE);

const appSetup = async () => {
  const app: INestApplication =
    await NestFactory.create<INestApplication>(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.listen(PORT);
  logger.log(blue(`Server is running on ${HOST} with mode: ${MODE}`));
};

const bootstrap = async () => {
  try {
    appSetup();
  } catch (err: unknown) {
    logger.error(`Something went wrong... Learn more at ${err}`);
  }
};

bootstrap();
