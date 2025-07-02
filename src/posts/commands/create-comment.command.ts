import { CreateCommentDto } from '../dto/create-comment.dto';

export class CreateCommentCommand {
  constructor(
    public readonly postId: number,
    public readonly createCommentDto: CreateCommentDto,
    public readonly authorId: number,
  ) {}
}