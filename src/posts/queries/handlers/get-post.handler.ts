import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../repositories/post.repository';
import { GetPostQuery } from '../get-post.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(query: GetPostQuery): Promise<PostResponseDto> {
    const { id } = query;
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

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
