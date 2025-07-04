import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationFilter } from './filters/validation.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.useGlobalFilters(new ValidationFilter());
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:5173',
      'https://blogsphere-v1.netlify.app',
    ],
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
