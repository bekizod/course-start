import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class PostResponseDto {
  id: number;
  title: string;
  content: string;
  author?: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
}