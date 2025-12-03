import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // 🎯 El servicio Primario escucha en el puerto 3001
  await app.listen(3001); 
  console.log(`Microservice PRIMARY is running on: ${await app.getUrl()}`);
}
bootstrap();