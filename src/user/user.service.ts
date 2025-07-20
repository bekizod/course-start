// src/user/user.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseFormat } from 'src/common/utils/response.util';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  [x: string]: any;
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User) 
    private UserRepo: Repository<User>,
  ) {
    // Initialize nodemailer transporter
    // In your UserService constructor
this.transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
  }


  async updateHasedRefreshToken(userId:number,hashedRefreshToken:any){
    return await this.UserRepo.update({id:userId},{hashedRefreshToken})
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.BASE_URL}/user/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email',
     html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 30px;
            background-color: #f9fafb;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            background-color: #f3f4f6;
            border-radius: 0 0 8px 8px;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">YourApp</div>
        <h2>Verify Your Email Address</h2>
    </div>
    
    <div class="content">
        <p>Hello,</p>
        <p>Thank you for registering with us! Please verify your email address to complete your account setup.</p>
        
        <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>This verification link will expire in 24 hours.</p>
    </div>
    
    <div class="footer">
        <p>© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
        <p>If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
    </div>
</body>
</html>
`
    });
  }

  async create(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create user with verification token
    const verificationToken = uuidv4();
    const user = this.UserRepo.create({
      ...createUserDto,
      isVerified: false,
      verificationToken,
    });

    const savedUser = await this.UserRepo.save(user);
    
    // Send verification email
    await this.sendVerificationEmail(savedUser.email, verificationToken);
    
    return ResponseFormat.success(
      'Registration successful. Please check your email to verify your account.',
      { data: { id: savedUser.id } }
    );
  }

  async updatePassword(email: string, updatePassword: string) {
  // Hash the new password before storing
  const hashedPassword = await hash(updatePassword, 10); 
  await this.UserRepo.update({ email }, { password: hashedPassword });
}

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.UserRepo.findOne({ 
      where: { verificationToken: token } 
    });
    
    if (!user) {
      return false;
    }

    await this.UserRepo.update(
      { id: user.id },
      { 
        isVerified: true,
        verificationToken: null,
      },
    );

    return true;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.UserRepo.findOne({
      where: { email },
    });
    return user ?? undefined;
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
}



