import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './all-exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true, 
      transform: true,           
    }),
  );
  app.use(cookieParser());
  app.use('/uploads', express.static('uploads'));

  const config = new DocumentBuilder()
    .setTitle('Online-Course')
    .setDescription(
      "Onlayn kurslarni sotib olishingiz uchun ishlab chiqilgan.",
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'accessToken',
        in: 'cookie',
      },
      'cookie-auth-key',
  )
    .addCookieAuth('access_token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  const uploadsPath = join(process.cwd(), 'uploads');

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/', 
  });

  // Server hatosi 500 qaytishi uchun
  app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
