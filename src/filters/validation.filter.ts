// src/filters/validation.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (status === 400 && Array.isArray(exceptionResponse['message'])) {
      // Transform the default NestJS validation error format
      const messages = exceptionResponse['message'] as string[];
      const formattedErrors = {};

      messages.forEach((message) => {
        // Extract field name from message (simple approach)
        const fieldMatch = message.match(/^([a-zA-Z0-9]+) /);
        if (fieldMatch) {
          const field = fieldMatch[1].toLowerCase();
          formattedErrors[field] = message;
        }
      });

      response.status(status).json({
        statusCode: status,
        status: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    } else {
      // Other types of errors
      response.status(status).json(exceptionResponse);
    }
  }
}
