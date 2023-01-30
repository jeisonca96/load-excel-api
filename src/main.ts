import { json } from 'express';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('Initializing application...');

  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  const limit = appConfig.bodyLimit;
  const port = appConfig.port;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Load Excel API')
    .setDescription(
      'API for Excel file upload with format validation and processing notification',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  logger.log('Setting custom limit for JSON body parser', { limit });
  app.use(json({ limit }));

  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}
bootstrap();
