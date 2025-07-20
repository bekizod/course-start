import { HttpStatus } from '@nestjs/common';

export class ResponseFormat<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
  id: any;
  email: any;
  userName: any;

  constructor(
    status: 'success' | 'error',
    message: string,
    options?: {
      data?: T;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  ) {
    this.status = status;
    this.message = message;
    this.data = options?.data;
    this.pagination = options?.pagination;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(
    message: string,
    options?: {
      data?: T;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  ): ResponseFormat<T> {
    return new ResponseFormat<T>('success', message, options);
  }

  static error<T>(
    message: string,
    options?: {
      data?: T;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  ): ResponseFormat<T> {
    return new ResponseFormat<T>('error', message, options);
  }

  static paginated<T>(
    message: string,
    data: T,
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  ): ResponseFormat<T> {
    return new ResponseFormat<T>('success', message, { data, pagination });
  }
}