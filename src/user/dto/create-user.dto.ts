/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  @PrimaryGeneratedColumn()
  id: number;
  // @IsOptional()
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
  password: string;
}
