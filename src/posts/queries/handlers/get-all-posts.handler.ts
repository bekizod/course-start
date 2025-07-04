import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../repositories/post.repository';
import { GetAllPostsQuery } from '../get-all-posts.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';
import { PaginatedResponseDto } from 'src/posts/dto/paginated-response.dto';
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from '../../repositories/comment.repository';
import { LikeRepository, LIKE_REPOSITORY } from '../../repositories/like.repository';

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepository,
    @Inject(LIKE_REPOSITORY)
    private readonly likeRepository: LikeRepository,
  ) {}

  async execute(
    query: GetAllPostsQuery,
  ): Promise<PaginatedResponseDto<PostResponseDto[]>> {
    const { page = 1, limit = 10, search = '', userId } = query;
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      this.postRepository.findWithPagination(skip, limit, search),
      this.postRepository.countAll(),
    ]);

    // Fetch comments for all posts in a single query
    const postsWithComments = await this.enrichPostsWithComments(posts);

    // Enrich posts with like information
    const postsWithLikes = await Promise.all(
      postsWithComments.map(async (post) => {
        const isLikedByMe = userId
          ? await this.likeRepository.isPostLikedByUser(userId, post.id)
          : false;
        return {
          ...post,
          isLikedByMe,
        };
      }),
    );

    return this.formatResponse(
      {
        data: postsWithLikes.map((post) => this.mapToResponseDto(post)),
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          ...(search && { search }),
        },
      },
      'Posts retrieved successfully',
    );
  }

  private async enrichPostsWithComments(posts: any[]): Promise<any[]> {
    const postIds = posts.map((post) => post.id);
    const allComments = await this.commentRepository.findByPostIds(postIds);

    const commentsByPostId = allComments.reduce((acc, comment) => {
      const postId = comment.post.id;
      if (!acc[postId]) {
        acc[postId] = [];
      }
      acc[postId].push(comment);
      return acc;
    }, {});

    return posts.map((post) => ({
      ...post,
      comments: commentsByPostId[post.id] || [],
    }));
  }

  private mapToResponseDto(post: any): PostResponseDto {
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
      isLikedByMe: post.isLikedByMe, // Added isLikedByMe field
      comments: post.comments
        ? post.comments.slice(0, 3).map((comment) => ({
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

  private formatResponse(
    data: any,
    message?: string,
  ): PaginatedResponseDto<PostResponseDto[]> {
    return {
      status: 'success',
      message: message || 'Operation successful',
      data: data.data,
      pagination: data.pagination,
    };
  }
}