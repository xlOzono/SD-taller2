import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CasillerosModule } from './casilleros/casilleros.module';
import { ReservasModule } from './reservas/reservas.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      // Pool de conexiones mejorado
      extra: {
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelayMs: 0,
      }
    }),

    CasillerosModule,           
    ReservasModule,
    AuthModule, 
    UsersModule             
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
