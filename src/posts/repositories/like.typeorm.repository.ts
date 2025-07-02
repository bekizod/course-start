import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
import { LikeRepository } from './like.repository';

import { Post } from '../entities/post.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class LikeTypeOrmRepository implements LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async likePost(userId: number, postId: number): Promise<Like> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existingLike) {
      return existingLike;
    }

    const like = this.likeRepository.create({ user, post });
    return this.likeRepository.save(like);
  }

  async unlikePost(userId: number, postId: number): Promise<void> {
    await this.likeRepository.delete({
      user: { id: userId },
      post: { id: postId },
    });
  }

  async isPostLikedByUser(userId: number, postId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    return !!like;
  }

  async countLikesForPost(postId: number): Promise<number> {
    return this.likeRepository.count({
      where: { post: { id: postId } },
    });
  }
}