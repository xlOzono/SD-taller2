import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findOneByRut(rut: string) {
    return this.usersRepository.findOneBy({ rut });
  }

  findOneById(id_usr: number) {
    return this.usersRepository.findOneBy({ id_usr });
  }

  async getUserIdByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user ? user.id_usr : null;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id_usr: number) {
    return this.usersRepository.findOneBy({ id_usr });
  }

  update(id_usr: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id_usr} user`;
  }

  remove(id_usr: number) {
    return `This action removes a #${id_usr} user`;
  }
}
