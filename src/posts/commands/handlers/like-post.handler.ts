import { LikeResponseDto } from 'src/posts/dto/like-response.dto';
import { LikePostCommand } from '../like-post.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  LIKE_REPOSITORY,
  LikeRepository,
} from 'src/posts/repositories/like.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand> {
  constructor(
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepository,
  ) {}

  async execute(command: LikePostCommand): Promise<LikeResponseDto> {
    const { postId, userId } = command;
    const { like, action } = await this.likeRepository.toggleLike(
      userId,
      postId,
    );

    return {
      status: 'success',
      message:
        action === 'liked'
          ? 'Post liked successfully'
          : 'Post unliked successfully',
      data: {
        ...(like
          ? {
              id: like.id,
              user: {
                id: like.user.id,
                username: like.user.userName,
                email: like.user.email,
              },
              postId: like.post.id,
            }
          : {}),
        action,
      },
    };
  }
}
