import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class LikeResponseDto {
  status: 'success';
  message: string;
  data: {
    id?: number;
    user?: UserResponseDto;
    postId?: number;
    action: 'liked' | 'unliked';
  };
}