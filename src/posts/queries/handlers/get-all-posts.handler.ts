import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../repositories/post.repository';
import { GetAllPostsQuery } from '../get-all-posts.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/posts/dto/paginated-response.dto';

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(
    query: GetAllPostsQuery,
  ): Promise<PaginatedResponseDto<PostResponseDto[]>> {
    const { page = 1, limit = 10, search = '' } = query;
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      this.postRepository.findWithPagination(skip, limit, search),
      this.postRepository.countAll(),
    ]);

    return this.formatResponse(
      {
        data: posts.map((post) => this.mapToResponseDto(post)),
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          ...(search && { search })
        },
      },
      'Posts retrieved successfully',
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
      commentCount: post.comments ? post.comments.length : 0, // Optional: Add comments count
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
