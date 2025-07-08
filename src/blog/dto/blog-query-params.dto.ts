import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class BlogQueryParamsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value || 'createdAt') // Fallback to default if empty string
  @IsString()
  @IsIn(['title', 'createdAt', 'author'], { message: 'sortBy must be one of: title, createdAt, author' })
  sortBy?: string = 'createdAt';

  @IsOptional()
  @Transform(({ value }) => value || 'DESC') // Fallback to default if empty string
  @IsString()
  @IsIn(['ASC', 'DESC'], { message: 'sortOrder must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsString()
  authorId?: string;
}