import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class CommentResponseDto {
  id: number;
  content: string;
  author: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
