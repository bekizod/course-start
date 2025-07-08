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
  createdAt: Date;

   @Expose()
  @Type(() => AuthorResponse)
  author: AuthorResponse;
}