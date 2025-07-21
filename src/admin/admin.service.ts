import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin, Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ResponseFormat } from 'src/common/utils/response.util';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      // Check if username exists
      const existingUser = await this.userRepository.findOne({
        where: { userName: createAdminDto.userName },
      });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      // Check if email exists
      const existingEmail = await this.userRepository.findOne({
        where: { email: createAdminDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }

      const user = this.userRepository.create(createAdminDto);
      user.role = createAdminDto.role; // Ensure role is set
      const savedUser = await this.userRepository.save(user);
      return ResponseFormat.success('Admin created successfully', {
        data: {
          id: savedUser.id,
          email: savedUser.email,
          userName: savedUser.userName,
          role: savedUser.role,
        },
      });
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Duplicate key violation');
      }
      throw error;
    }
  }

  async findAll(userID: number) {
    const roles = await this.userRepository.find({
      where: { role: In(['ADMIN', 'SUPERADMIN']) },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'userName',
        'isVerified',
        'role',
      ],
    });

    return ResponseFormat.success('Admins retrieved successfully', {
      data: roles,
    });
  }

  async findOne(id: number) {
    const roles = await this.userRepository.find({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'userName',
        'isVerified',
        'role',
      ],
    });

    if (!roles || (await roles)?.length === 0) {
      throw new NotFoundException('No admin found for this user');
    }
    console.log('Admin found:', roles);
    return ResponseFormat.success('Admin retrieved successfully', {
      data: roles,
    });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
