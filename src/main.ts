import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule , {cors : true});
  app.useGlobalPipes(new ValidationPipe(
    {whitelist : true }
 ));


 useContainer(app.select(AppModule), { fallbackOnErrors: true   });
  await app.listen( process.env.PORT || 3000 , '192.168.43.243');}
bootstrap();
