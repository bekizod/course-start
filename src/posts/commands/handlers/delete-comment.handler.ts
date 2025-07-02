import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { COMMENT_REPOSITORY, CommentRepository } from '../../repositories/comment.repository';
import { DeleteCommentCommand } from '../delete-comment.command';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { id, userId } = command;

    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Verify the user is the author of the comment
    if (comment.author.id !== userId) {
      throw new Error('You can only delete your own comments');
    }

    await this.commentRepository.delete(id);
  }
}