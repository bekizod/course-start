// src/posts/queries/handlers/get-post-comments.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from '../../repositories/comment.repository';
import { GetPostCommentsQuery } from '../get-post-comments.query';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/posts/dto/paginated-response.dto';

@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsHandler
  implements IQueryHandler<GetPostCommentsQuery>
{
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(
    query: GetPostCommentsQuery,
  ): Promise<PaginatedResponseDto<CommentResponseDto[]>> {
    const { postId, page, limit } = query;
    const skip = (page - 1) * limit;

    const [comments, totalCount] =
      await this.commentRepository.findByPostWithPagination(
        postId,
        skip,
        limit,
      );

    return this.formatResponse(
      comments.map((comment) => this.mapToResponseDto(comment)),
      totalCount,
      page,
      limit,
    );
  }

  private mapToResponseDto(comment: any): CommentResponseDto {
    return {
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.author.id,
        username: comment.author.username,
        email: comment.author.email,
      } as UserResponseDto,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  private formatResponse(
    data: CommentResponseDto[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponseDto<CommentResponseDto[]> {
    return {
      status: 'success',
      message: 'Comments retrieved successfully',
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
