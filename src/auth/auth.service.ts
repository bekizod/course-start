import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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