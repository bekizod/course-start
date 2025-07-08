import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseFormat } from '../utils/response.util';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<any>> {
    return next.handle().pipe(
      map((data) => {
        // If the response is already formatted, return as-is
        if (data?.status && data?.message) {
          return data;
        }

        // Format successful responses
        return ResponseFormat.success('Operation successful', data);
      }),
    );
  }
}