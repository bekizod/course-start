import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { POST_REPOSITORY } from '../../repositories/post.repository';
import { DeletePostCommand } from '../delete-post.command';
import { PostRepository } from '../../repositories/post.repository';
import { Inject } from '@nestjs/common';
@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { id, userId } = command;

    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.id !== userId) {
      throw new Error('You can only delete your own posts');
    }

    await this.postRepository.delete(id);
  }
}