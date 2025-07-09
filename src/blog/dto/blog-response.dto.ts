import { Expose, Type } from 'class-transformer';

export class AuthorResponse {
  @Expose()
  id: number;

  @Expose()
  userName: string;
}

export class BlogResponse {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  totalComments: number;

  @Expose()
@Type(() => CommentResponse)
comments?: CommentResponse[];


  @Expose()
  createdAt: Date;

   @Expose()
  @Type(() => AuthorResponse)
  author: AuthorResponse;
}



export class CommentResponse {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => AuthorResponse)
  user: AuthorResponse;
}