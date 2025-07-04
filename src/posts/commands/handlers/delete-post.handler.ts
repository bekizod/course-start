import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { POST_REPOSITORY } from '../../repositories/post.repository';
import { COMMENT_REPOSITORY } from '../../repositories/comment.repository';
import { DeletePostCommand } from '../delete-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { CommentRepository } from '../../repositories/comment.repository';
import { Inject } from '@nestjs/common';
import { 
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException 
} from '@nestjs/common';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { id, userId } = command;

    try {
      const post = await this.postRepository.findById(id);
      
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.author.id !== userId) {
        throw new ForbiddenException('You can only delete your own posts');
      }

      // First delete all comments
      await this.commentRepository.delete(id);
      
      // Then delete the post
      await this.postRepository.delete(id);
      
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete post: ' + error.message);
    }
  }
}