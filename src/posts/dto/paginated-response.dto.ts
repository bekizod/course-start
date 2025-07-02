export class PaginatedResponseDto<T> {
  status: 'success' | 'error';
  message: string;
  data: T;

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
