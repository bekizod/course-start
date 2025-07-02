import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LIKE_REPOSITORY, LikeRepository } from '../../repositories/like.repository';
import { CheckPostLikeQuery } from '../check-post-like.query';
import { Inject } from '@nestjs/common';


@QueryHandler(CheckPostLikeQuery)
export class CheckPostLikeHandler implements IQueryHandler<CheckPostLikeQuery> {
  constructor(
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepository
  ) {}

  async execute(query: CheckPostLikeQuery): Promise<{ isLiked: boolean }> {
    const isLiked = await this.likeRepository.isPostLikedByUser(
      query.userId,
      query.postId
    );
    return { isLiked };
  }
}