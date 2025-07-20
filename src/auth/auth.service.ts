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
import * as nodemailer from 'nodemailer';  
@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  private otpStorage: Map<string, { otp: string; expiresAt: number }> = new Map();


  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY) 
    private refreshTokenConfig:ConfigType<typeof refreshJwtConfig>
  ) {
    // Initialize nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

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

async sendPasswordResetOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Don't reveal whether email exists for security
      return ResponseFormat.success('If the email exists, an OTP has been sent');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

    // Store OTP
    this.otpStorage.set(email, { otp, expiresAt });

    // Send email
    await this.sendOtpEmail(email, otp);

    return ResponseFormat.success('If the email exists, an OTP has been sent');
  }

  async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
    const storedOtp = this.otpStorage.get(email);

    // Validate OTP
    if (!storedOtp || storedOtp.otp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (Date.now() > storedOtp.expiresAt) {
      this.otpStorage.delete(email);
      throw new UnauthorizedException('OTP has expired');
    }

    // Update password

    await this.userService.updatePassword(email, newPassword);

    // Clear OTP
    this.otpStorage.delete(email);

    return ResponseFormat.success('Password reset successfully');
  }

  private async sendOtpEmail(email: string, otp: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .otp { 
            font-size: 24px; 
            font-weight: bold; 
            color: #4f46e5;
            margin: 20px 0;
            padding: 10px 20px;
            background: #f5f3ff;
            display: inline-block;
            border-radius: 5px;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Here's your one-time password (OTP):</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your Password Reset OTP',
        html: html,
      });
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
  
async signOut(userId){
  await this.userService.updateHasedRefreshToken(userId,null)
  return ResponseFormat.success('Login Out successfully')
  }
}