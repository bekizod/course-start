import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      // Check if username exists
      const existingUser = await this.userService.findByEmail(createUserDto.userName);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      // Check if email exists
      const existingEmail = await this.userService.findByEmail(createUserDto.email);
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }

      // Create user
      const user = await this.userService.create(createUserDto);

      return {
        status: 'success',
        message: 'User registered successfully',
        data: {
          id: user.id,
          email: user.email,
          userName: user.userName,
        },
      };
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('Duplicate key violation');
      }
      throw error;
    }
  }
  
  async validateUser(email: string, password: string): Promise<{ id: number }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Invalid credentials',
      });
    }

    return { id: user.id };
  }

  login(userId: number): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}