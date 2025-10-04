import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/filters/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Nigeria Tax API')
    .setDescription('API to manage Nigerian tax categories and calculations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('elor', app, document);

  await app.listen(7777);
  console.log(`App is running at ${await app.getUrl()}`)
  console.log(`Current environment is ${process.env.NODE_ENV}`)

}
bootstrap();
