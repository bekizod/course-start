import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../repositories/post.repository';
import { GetPostQuery } from '../get-post.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';
import { LIKE_REPOSITORY, LikeRepository } from '../../repositories/like.repository';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepository,
  ) {}

  async execute(query: GetPostQuery): Promise<PostResponseDto> {
    const { id, userId } = query;
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if the current user liked this post
    const isLikedByMe = userId 
      ? await this.likeRepository.isPostLikedByUser(userId, id)
      : false;

    return this.mapToResponseDto(post, isLikedByMe);
  }

  private mapToResponseDto(post: any, isLikedByMe: boolean): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        username: post.author.userName,
        email: post.author.email,
      } as UserResponseDto,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes ? post.likes.length : 0,
      commentCount: post.comments ? post.comments.length : 0,
      isLikedByMe, // Added isLikedByMe field
      comments: post.comments
        ? post.comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            author: {
              id: comment.author.id,
              username: comment.author.userName,
              email: comment.author.email,
            },
          }))
        : [],
    };
  }
}