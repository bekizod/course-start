import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { COMMENT_REPOSITORY, CommentRepository } from '../../repositories/comment.repository';
import { CreateCommentCommand } from '../create-comment.command';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

import { Inject } from '@nestjs/common';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository) {}

  async execute(command: CreateCommentCommand): Promise<CommentResponseDto> {
    const { postId, createCommentDto, authorId } = command;
    const comment = await this.commentRepository.create(createCommentDto, authorId, postId);

    return this.mapToResponseDto(comment);
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
}