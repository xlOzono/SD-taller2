import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { CasillerosModule } from './casilleros/casilleros.module';
import { ReservasModule } from './reservas/reservas.module';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './users/users.module';
import { SeedService } from './casilleros/seed.service';
import { UsersSeedService } from './users/users-seed.service';



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

    CasillerosModule,           // Microservicio principal de Casilleros
    ReservasModule,             // Microservicio principal de Reservas
    UsersModule,                // Módulo de usuarios unificado
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private seedService: SeedService,
    private usersSeedService: UsersSeedService,
  ) {}

  async onModuleInit() {
    console.log('[APP] Inicializando datos de prueba...');
    try {
      await this.usersSeedService.seedUsers();
      await this.seedService.seedCasilleros();
      console.log('[APP] Datos de prueba inicializados correctamente');
    } catch (error) {
      console.error('[APP] Error al inicializar datos:', error);
    }
  }

  configure(consumer: MiddlewareConsumer) {
  }
}
