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
      // Check if username already exists
      const existingUser = await this.UserRepo.findOne({
        where: { userName: createUserDto.userName },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      // Check if email already exists
      const existingEmail = await this.UserRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }

      const user = this.UserRepo.create(createUserDto);
      await this.UserRepo.save(user);

      return {
        success: true,
        message: 'User created successfully',
        email: user.email,
      };
    } catch (error) {
      // Handle other potential database errors
      if (error.code === '23505') {
        // PostgreSQL unique violation code
        if (error.constraint === 'UQ_da5934070b5f2726ebfd3122c80') {
          throw new ConflictException('Username already exists');
        }
        throw new ConflictException('Duplicate key violation');
      }
      throw error;
    }
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
      select: ['id', 'email'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
