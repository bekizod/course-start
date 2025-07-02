import { Like } from '../entities/like.entity';

export interface LikeRepository {
  likePost(userId: number, postId: number): Promise<Like>;
  unlikePost(userId: number, postId: number): Promise<void>;
  isPostLikedByUser(userId: number, postId: number): Promise<boolean>;
  countLikesForPost(postId: number): Promise<number>;
}

export const LIKE_REPOSITORY = 'LIKE_REPOSITORY';