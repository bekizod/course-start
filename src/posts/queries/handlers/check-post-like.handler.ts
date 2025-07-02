import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LikeRepository } from '../../repositories/like.repository';
import { CheckPostLikeQuery } from '../check-post-like.query';
import { Inject } from '@nestjs/common';
import { POST_REPOSITORY } from 'src/posts/repositories/post.repository';

@QueryHandler(CheckPostLikeQuery)
export class CheckPostLikeHandler implements IQueryHandler<CheckPostLikeQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly likeRepository: LikeRepository) {}

  async execute(query: CheckPostLikeQuery): Promise<boolean> {
    const { postId, userId } = query;
    return this.likeRepository.isPostLikedByUser(userId, postId);
  }
}