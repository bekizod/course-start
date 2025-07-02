import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnlikePostCommand } from '../unlike-post.command';
import { LIKE_REPOSITORY, LikeRepository } from '../../repositories/like.repository';
import { Inject } from '@nestjs/common';


@CommandHandler(UnlikePostCommand)
export class UnlikePostHandler implements ICommandHandler<UnlikePostCommand> {
  constructor(
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepository) {}

  async execute(command: UnlikePostCommand): Promise<void> {
    const { postId, userId } = command;
    await this.likeRepository.unlikePost(userId, postId);
  }
}