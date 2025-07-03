import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationFilter } from './filters/validation.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ValidationFilter());
  app.enableCors({
    origin: ['localhost:3001','localhost:5173'],
    methods: 'GET,POST,PATCH,DELETE',
  });
  const config = new DocumentBuilder()
    .setTitle('Blog Posts API')
    .setDescription('API for managing blog posts, comments, and likes')
    .setVersion('1.0')
    .addBearerAuth() // For JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}
bootstrap();
