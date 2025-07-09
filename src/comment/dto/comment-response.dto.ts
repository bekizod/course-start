// src/comments/dto/comment-response.dto.ts
import { Expose, Type } from 'class-transformer';

class CommentUserResponse {
  @Expose()
  id: number;

  @Expose()
  userName: string;

  @Expose()
  email: string;
}

export class CommentResponse {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => CommentUserResponse)
  user: CommentUserResponse;
}