import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../repositories/post.repository';
import { GetMyPostsQuery } from '../get-my-posts.query';
import { PostResponseDto } from '../../dto/post-response.dto';

import { PaginatedResponseDto } from '../../dto/paginated-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';

@QueryHandler(GetMyPostsQuery)
export class GetMyPostsHandler implements IQueryHandler<GetMyPostsQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(
    query: GetMyPostsQuery,
  ): Promise<PaginatedResponseDto<PostResponseDto[]>> {
    const { userId, page = 1, limit = 10, search = '' } = query;
    console.log('checking' + JSON.stringify(query, null, 2));
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      this.postRepository.findByAuthorWithPagination(
        userId,
        skip,
        limit,
        search,
      ),
      this.postRepository.countByAuthor(userId, search),
    ]);

    return this.formatResponse(
      {
        data: posts.map((post) => this.mapToResponseDto(post)),
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          ...(search && { search }),
        },
      },
      'My posts retrieved successfully',
    );
  }

  private mapToResponseDto(post: any): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        username: post.author.username,
        email: post.author.email,
      } as UserResponseDto,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0,
    };
  }

  private formatResponse(
    data: any,
    message?: string,
  ): PaginatedResponseDto<PostResponseDto[]> {
    return {
      status: 'success',
      message: message || 'Operation successful',
      data: data.data,
      pagination: data.pagination,
    };
  }
}
