import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseFormat } from 'src/common/utils/response.util';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private UserRepo: Repository<User>) {}

  async updateHasedRefreshToken(userId:number,hashedRefreshToken:any){
    return await this.UserRepo.update({id:userId},{hashedRefreshToken})
  }
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
    const profileInfo =  await this.UserRepo.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'userName','hashedRefreshToken'],
    });


    return ResponseFormat.success('Profile retrieved successfully', {
    data: profileInfo
  });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
