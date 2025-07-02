/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '../../repositories/post.repository';
import { CreatePostCommand } from '../create-post.command';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { POST_REPOSITORY } from '../../repositories/post.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject(POST_REPOSITORY) 
    private readonly postRepository: PostRepository
  ) {}

  async execute(command: CreatePostCommand): Promise<PostResponseDto> {
    const { createPostDto, authorId } = command;
    const post = await this.postRepository.create(createPostDto, authorId);

    return this.mapToResponseDto(post);
  }

  private mapToResponseDto(post: any): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        username: post.author.userName,
        email: post.author.email,
      } as UserResponseDto,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes ? post.likes.length : 0,
    };
  }
}