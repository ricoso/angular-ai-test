import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', { exclude: ['/', '/index.html'] });
  const port = process.env['PORT'] ?? 3200;
  await app.listen(port);
  console.log(`Requirements Board running on http://localhost:${port}`);
}

void bootstrap();
