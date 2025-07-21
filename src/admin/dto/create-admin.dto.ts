import { IsString } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateAdminDto {
  // @IsOptional()
  @IsString()
  firstName?: string;
  // @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  userName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: Role; // Assuming role is a string, adjust if it's an enum or different type
}
