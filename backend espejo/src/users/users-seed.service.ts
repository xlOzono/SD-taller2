import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedUsers() {
    // Verificar si ya existen usuarios
    const count = await this.userRepository.count();
    if (count > 0) {
      console.log('[SEED] Usuarios ya existen, saltando seed');
      return;
    }

    console.log('[SEED] Creando usuarios de prueba...');

    const usuarios = [
      {
        rut: '12345678-9',
        name: 'Juan',
        surname: 'Pérez',
        email: 'juan@example.com',
        password: 'password123',
        role: 'estudiante',
        fingerprint: false,
      },
      {
        rut: '98765432-1',
        name: 'María',
        surname: 'García',
        email: 'maria@example.com',
        password: 'password123',
        role: 'estudiante',
        fingerprint: false,
      },
      {
        rut: '55555555-5',
        name: 'Carlos',
        surname: 'López',
        email: 'carlos@example.com',
        password: 'password123',
        role: 'estudiante',
        fingerprint: false,
      },
    ];

    const createdUsers = this.userRepository.create(usuarios);
    await this.userRepository.save(createdUsers);
    console.log(`[SEED] Se crearon ${createdUsers.length} usuarios`);
  }
}
