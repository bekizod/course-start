import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { POST_REPOSITORY, PostRepository } from '../../repositories/post.repository';
import { GetAllPostsQuery } from '../get-all-posts.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { Inject } from '@nestjs/common';


@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository) {}

  async execute(query: GetAllPostsQuery): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.findAll();
    return posts.map(post => this.mapToResponseDto(post));
  }

  private mapToResponseDto(post: any): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        username: post.author.username,
        email: post.author.email,
      } as UserResponseDto,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes ? post.likes.length : 0,
    };
  }
}