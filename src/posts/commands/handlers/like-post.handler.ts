import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LIKE_REPOSITORY, LikeRepository } from '../../repositories/like.repository';
import { LikePostCommand } from '../like-post.command';
import { LikeResponseDto } from '../../dto/like-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { POST_REPOSITORY } from 'src/posts/repositories/post.repository';
import { Inject } from '@nestjs/common';


@CommandHandler(LikePostCommand)
export class LikePostHandler implements ICommandHandler<LikePostCommand> {
  constructor(
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepository) {}

  async execute(command: LikePostCommand): Promise<LikeResponseDto> {
    const { postId, userId } = command;
    const like = await this.likeRepository.likePost(userId, postId);

    return {
      id: like.id,
      user: {
        id: like.user.id,
        username: like.user.userName,
        email: like.user.email,
      } as UserResponseDto,
      postId: like.post.id,
    };
  }
}