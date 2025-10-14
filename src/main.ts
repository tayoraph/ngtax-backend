import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/filters/response.interceptor';
  // main.ts or app.js
import * as fs from 'fs';
async function bootstrap() {


const logStream = fs.createWriteStream('startup.log', { flags: 'a' });
logStream.write(`[${new Date().toISOString()}] App started\n`);

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //app.setGlobalPrefix('elapi')
  app.useGlobalPipes(new ValidationPipe({  transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());


  const config = new DocumentBuilder()
    .setTitle('Nigeria Tax API')
    .setDescription('API to manage Nigerian tax categories and calculations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('eltax', app, document);
  var port = process.env.PORT ||7777
  await app.listen(port);
  console.log(`App is running at ${await app.getUrl()}`)
  console.log(`Current environment is ${process.env.NODE_ENV}`)

 

}
bootstrap();
