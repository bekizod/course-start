import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { COMMENT_REPOSITORY, CommentRepository } from '../../repositories/comment.repository';
import { GetPostCommentsQuery } from '../get-post-comments.query';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
// import { POST_REPOSITORY } from 'src/posts/repositories/post.repository';
import { Inject } from '@nestjs/common';


@QueryHandler(GetPostCommentsQuery)
export class GetPostCommentsHandler implements IQueryHandler<GetPostCommentsQuery> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository) {}

  async execute(query: GetPostCommentsQuery): Promise<CommentResponseDto[]> {
    const { postId } = query;
    const comments = await this.commentRepository.findByPost(postId);
    return comments.map(comment => this.mapToResponseDto(comment));
  }

  private mapToResponseDto(comment: any): CommentResponseDto {
    console.log('Mapping comment to response DTO:', comment);
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
}