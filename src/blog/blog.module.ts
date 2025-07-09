import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Blog } from './entities/blog.entity';
import { CommentsModule } from 'src/comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User]), CommentsModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
