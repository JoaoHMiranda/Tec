import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // URL do seu frontend Vite
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
