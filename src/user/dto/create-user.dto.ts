/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  @IsString()
  firstName?: string;
  // @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
