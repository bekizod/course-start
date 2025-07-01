/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './type/auth-jwtPayload';
// import { AuthJwtPayload } from './types/auth-jwtPayload';

// import * as argon2 from 'argon2';
// import { CurrentUser } from './types/current-user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id };
  }

  login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    // const token = this.jwtService.sign(payload);
    // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    // const { accessToken, refreshToken } = await this.generateTokens(userId);
    // const hashedRefreshToken = await argon2.hash(refreshToken);
    // await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return this.jwtService.sign(payload);
    // return {
    //   id: userId,
    //   //   accessToken,
    // };
  }
  //   async generateTokens(userId: number) {
  //     const payload: AuthJwtPayload = { sub: userId };
  //     const [accessToken] = await Promise.all([
  //       this.jwtService.signAsync(payload),
  //     ]);
  //     return {
  //       accessToken,
  //     };
  //   }

  //   async validateJwtUser(userId: number) {
  //     const user = await this.userService.findOne(userId);
  //     if (!user) throw new UnauthorizedException('User not found!');
  //     const currentUser: CurrentUser = { id: user.id, role: user.role };
  //     return currentUser;
  //   }
}
