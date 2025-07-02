/* eslint-disable prettier/prettier */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { POST_REPOSITORY } from '../../repositories/post.repository';
import { UpdatePostCommand } from '../update-post.command';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';
import { PostRepository } from '../../repositories/post.repository';
@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<PostResponseDto> {
    const { id, updatePostDto, userId } = command;

    const post = await this.postRepository.findByIdWithAuthor(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.id !== userId) {
      throw new Error('You can only update your own posts');
    }

    const updatedPost = await this.postRepository.update(id, updatePostDto);

    return this.mapToResponseDto(updatedPost);
  }

  private mapToResponseDto(post: any): PostResponseDto {
    
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author:
        ({
          id: post.author.id,
          email: post.author.email,
        } as UserResponseDto),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes ? post.likes.length : 0,
    };
  }
}
