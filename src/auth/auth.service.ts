import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './type/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { ResponseFormat } from 'src/common/utils/response.util';
import * as argon2 from 'argon2'
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

  async login(userId: number) {
    const {accessToken,refreshToken} = await this.generateTokens(userId)
    const hashedRefreshToken = await argon2.hash(refreshToken)
    await this.userService.updateHasedRefreshToken(userId,hashedRefreshToken)

    return ResponseFormat.success('Login successfully', {
    data: {
      id:userId,
      accessToken,
      refreshToken
  }
  })
  }

  async generateTokens(userId:number){
    const payload: AuthJwtPayload = {sub: userId}
    const [accessToken, refreshToken] = await Promise.all(
      [this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig)]
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(userId:number){

   const {accessToken,refreshToken} = await this.generateTokens(userId)
    const hashedRefreshToken = await argon2.hash(refreshToken)
    await this.userService.updateHasedRefreshToken(userId,hashedRefreshToken)
    return ResponseFormat.success('Login with refresh token successfully', {
    data: {
      id:userId,
      accessToken,
      refreshToken
  }
  });

}

async validateRefreshToken(userId: number, refreshToken: string) {
  const userResult = await this.userService.findOne(userId);
  const user = userResult?.data;
  if (!user || !user.hashedRefreshToken) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const isRefreshTokenValid = await argon2.verify(user.hashedRefreshToken, refreshToken);
  if (!isRefreshTokenValid) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken,refreshToken)

  if(!refreshTokenMatches) throw new UnauthorizedException('Invalid refresh token')

    return {id : userId}
}


async signOut(userId){
  await this.userService.updateHasedRefreshToken(userId,null)
  return ResponseFormat.success('Login Out successfully')
  }
}