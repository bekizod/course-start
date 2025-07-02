import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class LikeResponseDto {
  id: number;
  user: UserResponseDto;
  postId: number;
}