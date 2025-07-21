import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module'; // <-- Import UserModule

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule], // <-- Add UserModule here
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
