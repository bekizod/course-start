export class LoginResponseDto {
  status: 'success';
  message: string;
  data: {
    id: number;
    accessToken: string;
  };
}