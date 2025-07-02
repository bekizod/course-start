// src/posts/dto/like-status-response.dto.ts
export class LikeStatusResponseDto {
  status: 'success';
  message: string;
  data: {
    isLiked: boolean;
    postId: number;
  };
}