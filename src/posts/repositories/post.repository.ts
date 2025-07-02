import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

export interface PostRepository {
  create(post: CreatePostDto, authorId: number): Promise<Post>;
  findAll(options: {
    skip: number;
    limit: number;
    search?: string;
  }): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  update(id: number, updatePostDto: UpdatePostDto): Promise<Post>;
  delete(id: number): Promise<void>;
  findByAuthor(authorId: number): Promise<Post[]>;
  findByIdWithAuthor(id: number): Promise<Post | null>;
  findWithPagination(
    skip: number,
    limit: number,
    search: string,
  ): Promise<Post[]>;
  countAll(): Promise<number>;
}

export const POST_REPOSITORY = 'POST_REPOSITORY';
