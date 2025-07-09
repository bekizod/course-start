// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Blog, User])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}