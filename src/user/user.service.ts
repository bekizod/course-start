import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private UserRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.UserRepo.create(createUserDto);
    return this.UserRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.UserRepo.findOne({
      where: {
        email,
      },
    });
  }

  async findOne(id: number) {
    return await this.UserRepo.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'userName'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
