import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './type/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { ResponseFormat } from 'src/common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) private refreshTokenConfig:ConfigType<typeof refreshJwtConfig>
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

  login(userId: number) {
    const payload : AuthJwtPayload = { sub: userId };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload,this.refreshTokenConfig)
    return({
      id:userId,
      token,
      refreshToken
    })
  }

  refreshToken(userId:number){

    const payload: AuthJwtPayload = {sub : userId};
    const token = this.jwtService.sign(payload)

    return ResponseFormat.success('refresh Token retrieved successfully', {
    data: {
      id:userId,
      token
    }
  });
}
}