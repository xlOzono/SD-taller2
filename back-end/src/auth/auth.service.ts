import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ rut, name, surname, email, password }: RegisterDto) {
    const userByEmail = await this.usersService.findOneByEmail(email);
    if (userByEmail) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const userByRut = await this.usersService.findOneByRut(rut);
    if (userByRut) {
      throw new BadRequestException('El RUT ya está registrado');
    }

    await this.usersService.create({
      rut,
      name,
      surname,
      email,
      password: await bcrypt.hash(password, 10),
    });

    return {
      name,
      email,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Correo no registrado");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Contraseña incorrecta");
    }

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
    };
  }

  
}
