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
    try {
      const user = this.UserRepo.create(createUserDto);
      return await this.UserRepo.save(user);
    } catch (error) {
      // Handle duplicate email error
      if (
        error.code === '23505' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.constraint === 'UQ_e12875dfb3b1d92d7d7c5377e22'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        throw new ConflictException('Email already exists');
      }
      // Re-throw other errors
      throw error;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
