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
}

export const COMMENT_REPOSITORY = 'COMMENT_REPOSITORY';
