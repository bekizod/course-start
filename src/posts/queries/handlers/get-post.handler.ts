/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../repositories/post.repository';
import { GetPostQuery } from '../get-post.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/posts/dto/paginated-response.dto';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(
    query: GetPostQuery,
  ): Promise<PaginatedResponseDto<PostResponseDto[]>> {
    const { id } = query;
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    return this.formatResponse(
      this.mapToResponseDto(post),
      'Post retrieved successfully',
    );
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
      commentCount: post.comments ? post.comments.length : 0, // Added comments count
    };
  }

  private formatResponse(data: PostResponseDto, message?: string): any {
    return {
      status: 'success',
      message: message || 'Operation successful',
      data,
    };
  }
}
