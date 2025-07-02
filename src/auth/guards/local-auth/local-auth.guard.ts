import { Injectable, BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = plainToClass(LoginDto, request.body);
    
    try {
      await validateOrReject(body);
    } catch (errors) {
      // Transform validation errors to simplified format
      const errorResponse = {};
      errors.forEach(error => {
        errorResponse[error.property] = Object.values(error.constraints).join(', ');
      });
      
      throw new BadRequestException({
        status: 'error',
        message: 'Validation failed',
        errors: errorResponse,
      });
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}