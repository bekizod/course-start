import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';

export interface CommentRepository {
  create(
    comment: CreateCommentDto,
    authorId: number,
    postId: number,
  ): Promise<Comment>;
  findByPost(postId: number): Promise<Comment[]>;
  findById(id: number): Promise<Comment | null>;
  delete(id: number): Promise<void>;
  findByPostWithPagination(
    postId: number, 
    skip: number, 
    limit: number
  ): Promise<[Comment[], number]>; // Returns comments and total count
  // In your CommentRepository interface
 findByPostIds(postIds: number[]): Promise<Comment[]>;
}

export const COMMENT_REPOSITORY = 'COMMENT_REPOSITORY';
