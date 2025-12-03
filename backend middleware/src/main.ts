import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // 🎯 El Gateway escucha en el puerto 3000
  await app.listen(3000); 
  console.log(`Gateway Service is running on: ${await app.getUrl()}`);
}
bootstrap();