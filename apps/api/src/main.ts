import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const envOrigins = (process.env.CORS_ORIGIN ?? process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowedOrigins = [
    ...new Set([
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      ...envOrigins,
    ]),
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-skip-auth'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  const basePort = Number(process.env.API_PORT ?? process.env.PORT ?? 5000);
  const maxPortAttempts = 20;

  for (let offset = 0; offset < maxPortAttempts; offset += 1) {
    const port = basePort + offset;
    try {
      await app.listen(port);
      logger.log(`API listening on port ${port}`);
      return;
    } catch (error) {
      const isAddressInUse =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'EADDRINUSE';

      if (!isAddressInUse) {
        throw error;
      }

      logger.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
    }
  }

  throw new Error(
    `Unable to bind API server after ${maxPortAttempts} attempts starting at port ${basePort}.`,
  );
}

bootstrap();
