import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('customer.server');
  const  logger =   new Logger('boostrap');

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || serverConfig.port;

  if( process.env.NODE_ENV === 'development' ){
    app.enableCors();
  }

  await app.listen(port);
  logger.log(`Aplication listening on  http://localhost:${port}`);
}
bootstrap();
