import { IsNumber, IsString } from 'class-validator';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class PostResponseDto {
  @IsNumber()
  id: number;
  @IsString()
  title: string;
  @IsString()
  content: string;

  @IsNumber()
  author?: UserResponseDto;
  createdAt: Date;
  updatedAt: Date;
  @IsNumber()
  likesCount: number;

  @IsNumber()
  commentCount?: number; 

  isLikedByMe?: boolean;

  comments?: any[];
}