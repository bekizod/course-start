import { Like } from '../entities/like.entity';

export interface LikeRepository {
  likePost(userId: number, postId: number): Promise<Like>;
  unlikePost(userId: number, postId: number): Promise<void>;
  isPostLikedByUser(userId: number, postId: number): Promise<boolean>;
  countLikesForPost(postId: number): Promise<number>;
  isPostLikedByUser(userId: number, postId: number): Promise<boolean>;
  toggleLike(
    userId: number,
    postId: number,
  ): Promise<{
    like: Like | null;
    action: 'liked' | 'unliked';
  }>;
}

export const LIKE_REPOSITORY = 'LIKE_REPOSITORY';
