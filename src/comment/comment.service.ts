// src/comments/comments.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../entities/user.entity';
import { Blog } from '../blog/entities/blog.entity';
import { ResponseFormat } from '../common/utils/response.util';
import { CommentResponse } from './dto/comment-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

 async create(
  createCommentDto: CreateCommentDto,
  user: User,
): Promise<ResponseFormat<CommentResponse>> {
  const blog = await this.blogRepository.findOne({
    where: { id: createCommentDto.blogId },
  });

  if (!blog) {
    throw new NotFoundException('Blog not found');
  }

  const comment = this.commentRepository.create({
    content: createCommentDto.content,
    blog,
    user,
  });

  const savedComment = await this.commentRepository.save(comment);
  
  // Reload the comment with user relation
  const commentWithUser = await this.commentRepository.findOne({
    where: { id: savedComment.id },
    relations: ['user']
  });

  // Transform to response DTO
  const commentResponse = plainToInstance(CommentResponse, commentWithUser, {
    excludeExtraneousValues: true
  });

  return ResponseFormat.success('Comment created successfully', {
    data: commentResponse
  });
}
  async findByBlogId(blogId: number): Promise<ResponseFormat<CommentResponse[]>> {
  const comments = await this.commentRepository.find({
    where: { blog: { id: blogId } },
    relations: ['user'],
    order: { createdAt: 'DESC' },
  });

  const commentsResponse = plainToInstance(CommentResponse, comments, {
    excludeExtraneousValues: true
  });

  return ResponseFormat.success('Comments retrieved successfully', {
    data: commentsResponse
  });
}

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<ResponseFormat<CommentResponse>> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this comment',
      );
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepository.save(comment);

    const commentsUpdateResponse = plainToInstance(CommentResponse, updatedComment, {
    excludeExtraneousValues: true
  });

    return ResponseFormat.success('Comment updated successfully', {
      data: commentsUpdateResponse,
    });
  }

  async remove(id: number, user: User): Promise<ResponseFormat<void>> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this comment',
      );
    }

    await this.commentRepository.remove(comment);
    return ResponseFormat.success('Comment deleted successfully');
  }
}