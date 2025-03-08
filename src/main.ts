import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable JSON body parsing
  app.use(
    '/kinde-webhook',
    express.raw({
      type: '*/*',
      limit: '1mb'
    })
  );
  
  // Regular JSON parser for other routes
  app.use(express.json())
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies if needed
  });

  console.log('Server running on port', process.env.PORT ?? 3001);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
